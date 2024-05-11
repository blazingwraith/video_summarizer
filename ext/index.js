function generatePDF() {
  // Get the text from the textarea
  const text = document.getElementById("output").value;

  // Create a new jsPDF instance
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF();

  // Add the text to the PDF
  pdf.text(text, 10, 10);

  // Save the PDF with a name
  pdf.save("output.pdf");
}
