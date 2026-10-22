// Download the reviewed A4 document in the selected language.
// Regenerate both documents with: python scripts/build_cv.py
window.generateCvPdf = function () {
    const language = document.documentElement.lang === 'en' ? 'en' : 'es';
    const link = document.createElement('a');
    link.href = `assets/cv/Ivan_Matus_CV_${language}.pdf`;
    link.download = `Ivan_Matus_CV_${language}.pdf`;
    document.body.append(link);
    link.click();
    link.remove();
};
document.getElementById('downloadCvBtn')?.addEventListener('click', window.generateCvPdf);
