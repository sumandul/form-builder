import html2canvas from 'html2canvas';

// eslint-disable-next-line import/prefer-default-export
export const handleDownloadPNG = (refElement: any, filename = 'chart') => {
  if (!refElement || !refElement.current) return;
  document.body.style.lineHeight = '13px';
  html2canvas(refElement.current, { allowTaint: true }).then(canvas => {
    const canvasUrl = canvas.toDataURL();
    // Create an anchor, and set the href value to our data URL
    const createEl = document.createElement('a');
    createEl.href = canvasUrl;

    // This is the name of our downloaded file
    createEl.download = `${filename}.png`;

    // Click the download button, causing a download, and then remove it
    createEl.click();
    createEl.remove();
    document.body.style.lineHeight = 'inherit';
  });
};
