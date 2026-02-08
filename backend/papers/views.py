import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Paper
from .ai import call_openrouter


# ─── helpers ────────────────────────────────────────────────

def paper_to_dict(p):
    return {
        'id':         p.id,
        'filename':   p.filename,
        'title':      p.title,
        'summary':    p.summary,
        'insights':   p.insights,
        'created_at': p.created_at.isoformat(),
    }


# ─── list ───────────────────────────────────────────────────

@require_http_methods(['GET'])
def list_papers(request):
    papers = Paper.objects.all()
    return JsonResponse([paper_to_dict(p) for p in papers], safe=False)


# ─── upload ─────────────────────────────────────────────────

@csrf_exempt
@require_http_methods(['POST'])
def upload_paper(request):
    file = request.FILES.get('file')
    if not file:
        return JsonResponse({'error': 'No file provided.'}, status=400)

    # We also accept extracted text from the frontend (optional)
    text = request.POST.get('text', '')

    paper = Paper.objects.create(
        filename=file.name,
        title=file.name.replace('.pdf', '').replace('_', ' ').replace('-', ' ').strip(),
        file=file,
        text=text,
    )
    return JsonResponse(paper_to_dict(paper), status=201)


# ─── detail ─────────────────────────────────────────────────

@require_http_methods(['GET'])
def paper_detail(request, pk):
    try:
        paper = Paper.objects.get(pk=pk)
    except Paper.DoesNotExist:
        return JsonResponse({'error': 'Not found.'}, status=404)
    return JsonResponse(paper_to_dict(paper))


# ─── delete ─────────────────────────────────────────────────

@csrf_exempt
@require_http_methods(['DELETE'])
def delete_paper(request, pk):
    try:
        paper = Paper.objects.get(pk=pk)
    except Paper.DoesNotExist:
        return JsonResponse({'error': 'Not found.'}, status=404)
    if paper.file:
        paper.file.delete(save=False)
    paper.delete()
    return JsonResponse({'status': 'deleted'})


# ─── summarize ──────────────────────────────────────────────

@csrf_exempt
@require_http_methods(['POST'])
def summarize_paper(request, pk):
    try:
        paper = Paper.objects.get(pk=pk)
    except Paper.DoesNotExist:
        return JsonResponse({'error': 'Not found.'}, status=404)

    # Use stored text; if empty, return error
    text = paper.text
    if not text:
        return JsonResponse({'error': 'No extracted text available for this paper.'}, status=400)

    prompt = (
        f"You are a research paper analyst. Given the following paper text, produce a structured summary.\n\n"
        f"Return your response as a JSON object with exactly these keys:\n"
        f"  \"abstract\"     : A 2-3 sentence overview of the paper.\n"
        f"  \"methodology\"  : How the research was conducted.\n"
        f"  \"findings\"     : The main results and discoveries.\n"
        f"  \"limitations\"  : Weaknesses or constraints noted.\n\n"
        f"Return ONLY valid JSON. No extra text.\n\n"
        f"Paper text:\n{text[:6000]}"
    )

    try:
        raw = call_openrouter(prompt)
        # Strip markdown fences if present
        raw = raw.strip()
        if raw.startswith('```'):
            raw = raw.split('```')[1]
            if raw.startswith('json'):
                raw = raw[4:]
        summary = json.loads(raw)
    except Exception as e:
        return JsonResponse({'error': f'AI processing failed: {str(e)}'}, status=500)

    paper.summary = summary
    paper.save()
    return JsonResponse(paper_to_dict(paper))


# ─── insights ───────────────────────────────────────────────

@csrf_exempt
@require_http_methods(['POST'])
def extract_insights(request, pk):
    try:
        paper = Paper.objects.get(pk=pk)
    except Paper.DoesNotExist:
        return JsonResponse({'error': 'Not found.'}, status=404)

    text = paper.text
    if not text:
        return JsonResponse({'error': 'No extracted text available.'}, status=400)

    prompt = (
        f"You are a technical research analyst. Extract deep insights from this paper.\n\n"
        f"Return your response as a JSON object with exactly these keys:\n"
        f"  \"objectives\"   : The stated goals or research questions.\n"
        f"  \"concepts\"     : Key technical concepts, terms, and frameworks used.\n"
        f"  \"conclusions\"  : The final conclusions and takeaways.\n\n"
        f"Return ONLY valid JSON. No extra text.\n\n"
        f"Paper text:\n{text[:6000]}"
    )

    try:
        raw = call_openrouter(prompt)
        raw = raw.strip()
        if raw.startswith('```'):
            raw = raw.split('```')[1]
            if raw.startswith('json'):
                raw = raw[4:]
        insights = json.loads(raw)
    except Exception as e:
        return JsonResponse({'error': f'AI processing failed: {str(e)}'}, status=500)

    paper.insights = insights
    paper.save()
    return JsonResponse(paper_to_dict(paper))


# ─── search ─────────────────────────────────────────────────

@require_http_methods(['GET'])
def search_papers(request):
    q = request.GET.get('q', '').strip().lower()
    if not q:
        return JsonResponse([], safe=False)

    results = []
    for paper in Paper.objects.all():
        # Simple keyword match across title, text, summary, insights
        haystack = ' '.join([
            paper.title or '',
            paper.filename or '',
            paper.text or '',
            json.dumps(paper.summary or {}),
            json.dumps(paper.insights or {}),
        ]).lower()

        if q in haystack:
            # Find a snippet around the match
            idx = haystack.find(q)
            start = max(0, idx - 80)
            end   = min(len(haystack), idx + len(q) + 120)
            snippet = haystack[start:end].strip()
            if start > 0:
                snippet = '…' + snippet
            if end < len(haystack):
                snippet = snippet + '…'

            results.append({
                **paper_to_dict(paper),
                'snippet': snippet,
                'score': 0.85,  # placeholder relevance
            })

    return JsonResponse(results, safe=False)


# ─── chat ───────────────────────────────────────────────────

@csrf_exempt
@require_http_methods(['POST'])
def chat_with_paper(request):
    try:
        body = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON body.'}, status=400)

    paper_id = body.get('paper_id')
    question = body.get('question', '').strip()
    language  = body.get('language', 'en')

    if not paper_id or not question:
        return JsonResponse({'error': 'paper_id and question are required.'}, status=400)

    try:
        paper = Paper.objects.get(pk=paper_id)
    except Paper.DoesNotExist:
        return JsonResponse({'error': 'Paper not found.'}, status=404)

    text = paper.text
    if not text:
        return JsonResponse({'error': 'No text available for this paper.'}, status=400)

    lang_instruction = ''
    if language != 'en':
        lang_map = {
            'hi': 'Hindi', 'es': 'Spanish', 'fr': 'French',
            'de': 'German', 'ja': 'Japanese', 'zh': 'Chinese',
        }
        lang_name = lang_map.get(language, 'English')
        lang_instruction = f"\nRespond in {lang_name}."

    prompt = (
        f"You are a research assistant helping a user understand an academic paper.\n"
        f"Answer the following question based ONLY on the paper text provided.{lang_instruction}\n"
        f"Be concise and accurate.\n\n"
        f"Paper text:\n{text[:6000]}\n\n"
        f"Question: {question}\n\n"
        f"Answer:"
    )

    try:
        answer = call_openrouter(prompt)
    except Exception as e:
        return JsonResponse({'error': f'AI processing failed: {str(e)}'}, status=500)

    return JsonResponse({'answer': answer.strip()})


# ─── signup ─────────────────────────────────────────────────

@csrf_exempt
@require_http_methods(['POST'])
def signup(request):
    try:
        body = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON body.'}, status=400)

    username = body.get('username', '').strip()
    email = body.get('email', '').strip()
    password = body.get('password', '')

    if not username or not email or not password:
        return JsonResponse({'error': 'Username, email, and password are required.'}, status=400)

    if User.objects.filter(username=username).exists():
        return JsonResponse({'error': 'Username already exists.'}, status=400)

    if User.objects.filter(email=email).exists():
        return JsonResponse({'error': 'Email already exists.'}, status=400)

    try:
        user = User.objects.create_user(username=username, email=email, password=password)
        refresh = RefreshToken.for_user(user)
        return JsonResponse({
            'message': 'User created successfully.',
            'user_id': user.id,
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }, status=201)
    except Exception as e:
        return JsonResponse({'error': f'Failed to create user: {str(e)}'}, status=500)


# ─── login ──────────────────────────────────────────────────

@csrf_exempt
@require_http_methods(['POST'])
def login_view(request):
    try:
        body = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON body.'}, status=400)

    username = body.get('username', '').strip()
    password = body.get('password', '')

    if not username or not password:
        return JsonResponse({'error': 'Username and password are required.'}, status=400)

    user = authenticate(request, username=username, password=password)
    if user is not None:
        refresh = RefreshToken.for_user(user)
        return JsonResponse({
            'message': 'Login successful.',
            'user_id': user.id,
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }, status=200)
    else:
        return JsonResponse({'error': 'Invalid credentials.'}, status=401)
