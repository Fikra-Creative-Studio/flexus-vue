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

export function formatCPNJ(cnpj) {
  if (!cnpj) return "";
  return cnpj.replace(
    /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
    "$1.$2.$3/$4-$5"
  );
}

export function formatDate(date) {
  const options = { year: "numeric", month: "2-digit", day: "2-digit" };
  return new Date(date).toLocaleDateString("pt-BR", options);
}

export function formatDateToISO(date) {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function handleAxiosError(error) {
  Swal.fire(
    "Erro",
    error.response?.data?.error || "Desculpe, tivemos um problema.",
    "error"
  );
}
