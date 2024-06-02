from qiskit_ibm_runtime.fake_provider import FakeJakartaV2
from qiskit_aer.noise import NoiseModel
from qiskit_aer import AerSimulator
from dataclasses import dataclass
from qiskit.providers import Backend


@dataclass(frozen=False)
class Backend_NoiseModel:
    """Can't extract the noise model from the backend,
    so we need to store them together."""

    backend: Backend = AerSimulator()
    noise_model: NoiseModel = NoiseModel()
    init_fidelity: float = 1.0
    name: str = "default"


fake_backend = FakeJakartaV2()
noise_model = NoiseModel.from_backend(fake_backend)
backend = Backend_NoiseModel(
    backend=AerSimulator(
        noise_model=noise_model,
        coupling_map=fake_backend.coupling_map,
        basis_gates=noise_model.basis_gates,
    ),
    noise_model=noise_model,
    init_fidelity=1.0,
    name=fake_backend.name,
)
