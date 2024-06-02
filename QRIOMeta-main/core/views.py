from django.shortcuts import render
from django.http import JsonResponse
from .models import Circuit, CircuitScore
from .utils import CircuitScorer, FidelityScorer, TopologyScorer

def upload_file(request):
    response = None
    if request.method == 'POST' and request.FILES.get('file'):
        uploaded_file = request.FILES['file']
        name = request.POST.get('name', '')
        uploaded_file_obj = Circuit(circuit_file=uploaded_file, name=name)
        uploaded_file_obj.save()
        response = JsonResponse({'message': 'File uploaded and saved to model successfully'}, status=200)
    else:
        response = JsonResponse({'error': 'No file provided'}, status=400)
    
    response["Access-Control-Allow-Origin"] = "*"
    response["Access-Control-Allow-Methods"] = "POST"

    return response

def upload_fidelity(request):
    response = None
    if request.method == 'POST':
        try:
            uploaded_file = request.FILES['file']
            name = request.POST.get('name', '')
            fidelity = float(request.POST.get('fidelity', '0.0'))
            uploaded_file_obj = Circuit(circuit_file=uploaded_file, name=name, fidelity=fidelity)
            uploaded_file_obj.save()
            response = JsonResponse({'message': 'File and fidelity uploaded and saved to model successfully'}, status=200)
        except:
            response = JsonResponse({"message": "improper request"}, status=400)
    
    response["Access-Control-Allow-Origin"] = "*"
    response["Access-Control-Allow-Methods"] = "POST"

    return response
    
def get_score(request, name, device):
    if request.method == 'GET':
        circuit_obj = Circuit.objects.get(name=name)
        circuit_scorer: CircuitScorer = None
        if circuit_obj.fidelity:
            circuit_scorer = FidelityScorer()
        else:
            circuit_scorer = TopologyScorer()
        result = circuit_scorer.score_circuit(circuit_obj, device)
        return JsonResponse({"score":result}, status=200)
        # if result >= 0.0:
        #     return JsonResponse({"score":result}, status=200)
        # return JsonResponse({"message":"Bad request"}, status=400)
    return JsonResponse({"message":"Method not supported"},status=400)
    

