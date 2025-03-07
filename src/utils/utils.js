import Swal from "sweetalert2";

export function formatSelect(array = [], keyName, keyValue) {
  if (!Array.isArray(array)) {
    console.error("formatSelect: O primeiro argumento precisa ser um array.");
    return [];
  }

  return array.map(item => ({
    name: item[keyName] ?? "",
    value: item[keyValue] ?? "",
  }));
}

export function handleAxiosError(error) {
  Swal.fire(
    "Erro",
    error.response?.data?.error || "Desculpe, tivemos um problema.",
    "error"
  );
}
