import React, { useEffect, useRef, useState } from 'react';
import heic2any from 'heic2any';

const TITLE_PREFIXES = ['Chain', 'AI', 'Protocol', 'Design', 'Data', 'Infra', 'Growth'];
const TITLE_SUFFIXES = ['Alchemist', 'Wizard', 'Ranger', 'Architect', 'Pilot', 'Ninja', 'Captain'];

function randomItem(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function generateBuilderTitle() {
  return `${randomItem(TITLE_PREFIXES)} ${randomItem(TITLE_SUFFIXES)}`;
}

export default function HHGoaCardGenerator() {
  const [hasStarted, setHasStarted] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);
  const [name, setName] = useState('');
  const [handle, setHandle] = useState('');
  const [role, setRole] = useState('');
  const [builderTitle, setBuilderTitle] = useState(generateBuilderTitle);
  const [builderId, setBuilderId] = useState(
    '#HH-GOA-' + Math.floor(1000 + Math.random() * 9000)
  );
  const [imageSrc, setImageSrc] = useState(null);
  const [headerImg, setHeaderImg] = useState(null);
  const [formError, setFormError] = useState('');
  const [cardDataUrl, setCardDataUrl] = useState('');
  const canvasRef = useRef(null);

  useEffect(() => {
    const img = new Image();
    img.onload = () => setHeaderImg(img);
    img.src = '/assets/hacker-house.png';
  }, []);

  const isFormValid = name.trim() && handle.trim() && role.trim() && builderId.trim() && imageSrc;

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      setImageSrc(null);
      return;
    }

    try {
      let sourceBlob = file;
      const nameLower = file.name.toLowerCase();
      const isHeic =
        file.type === 'image/heic' ||
        file.type === 'image/heif' ||
        nameLower.endsWith('.heic') ||
        nameLower.endsWith('.heif');

      if (isHeic) {
        const converted = await heic2any({
          blob: file,
          toType: 'image/jpeg',
          quality: 0.9,
        });
        sourceBlob = Array.isArray(converted) ? converted[0] : converted;
      }

      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        setImageSrc(uploadEvent.target.result);
        setFormError('');
      };
      reader.readAsDataURL(sourceBlob);
    } catch {
      setImageSrc(null);
      setFormError('Unable to read this photo. Please try JPG/PNG/HEIC again.');
    }
  };

  const handleGenerate = (e) => {
    e.preventDefault();
    if (!isFormValid) {
      setIsGenerated(false);
      setFormError('All fields are mandatory, including photo upload.');
      return;
    }
    setFormError('');
    setIsGenerated(true);
  };

  useEffect(() => {
    if (!isGenerated) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = 600;
    canvas.height = 900;

    const drawCard = (profileImg) => {
      const bgGradient = ctx.createLinearGradient(0, 0, 600, 900);
      bgGradient.addColorStop(0, '#0B6839');
      bgGradient.addColorStop(0.55, '#0A5E34');
      bgGradient.addColorStop(1, '#07311E');
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, 600, 900);

      const halo = ctx.createRadialGradient(300, 305, 20, 300, 305, 240);
      halo.addColorStop(0, 'rgba(254,225,1,0.2)');
      halo.addColorStop(1, 'rgba(254,225,1,0)');
      ctx.fillStyle = halo;
      ctx.fillRect(0, 0, 600, 900);

      ctx.fillStyle = 'rgba(254,225,1,0.08)';
      ctx.fillRect(30, 30, 540, 840);

      ctx.strokeStyle = '#FEE101';
      ctx.lineWidth = 5;
      ctx.strokeRect(20, 20, 560, 860);

      ctx.strokeStyle = '#F9DC01';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(30, 30, 540, 840);

      if (headerImg) {
        const width = 520;
        const height = width * (headerImg.height / headerImg.width);
        ctx.drawImage(headerImg, (600 - width) / 2, 52, width, height);
      } else {
        ctx.fillStyle = '#FEE101';
        ctx.font = 'bold 54px serif';
        ctx.textAlign = 'center';
        ctx.fillText('HACKER HOUSE', 300, 105);
      }

      ctx.fillStyle = '#FEE101';
      ctx.font = '13px monospace';
      ctx.textAlign = 'left';
      ctx.fillText('GOA, INDIA  •  28 - 31 OCT 2026', 40, 172);
      ctx.textAlign = 'right';
      ctx.fillText('2:47 PM STUDIO', 560, 172);

      const scale = Math.max(216 / profileImg.width, 216 / profileImg.height);
      const sourceWidth = 216 / scale;
      const sourceHeight = 216 / scale;
      const sourceX = (profileImg.width - sourceWidth) / 2;
      const sourceY = (profileImg.height - sourceHeight) / 2;

      ctx.save();
      ctx.beginPath();
      ctx.arc(300, 320, 108, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(
        profileImg,
        sourceX,
        sourceY,
        sourceWidth,
        sourceHeight,
        192,
        212,
        216,
        216
      );
      ctx.restore();

      ctx.beginPath();
      ctx.arc(300, 320, 111, 0, Math.PI * 2);
      ctx.strokeStyle = '#FEE101';
      ctx.lineWidth = 4;
      ctx.stroke();

      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 40px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(name.trim(), 300, 500);

      ctx.fillStyle = '#FEE101';
      ctx.font = 'bold 22px sans-serif';
      ctx.fillText(handle.trim(), 300, 538);

      ctx.fillStyle = '#0A3F27';
      ctx.fillRect(95, 565, 410, 52);
      ctx.strokeStyle = '#FEE101';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(95, 565, 410, 52);
      ctx.fillStyle = '#FEE101';
      ctx.font = 'bold 19px sans-serif';
      ctx.fillText(role.trim().toUpperCase(), 300, 598);

      ctx.fillStyle = '#D1FAE5';
      ctx.font = 'bold 18px sans-serif';
      ctx.fillText(builderTitle.trim().toUpperCase(), 300, 632);

      ctx.fillStyle = '#0A3A24';
      ctx.fillRect(80, 662, 440, 122);
      ctx.strokeStyle = '#FEE101';
      ctx.strokeRect(80, 662, 440, 122);
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '14px monospace';
      ctx.fillText('OFFICIAL ID NUMBER', 300, 694);
      ctx.fillStyle = '#F9DC01';
      ctx.font = 'bold 30px monospace';
      ctx.fillText(builderId.trim(), 300, 738);
      ctx.fillStyle = '#D1FAE5';
      ctx.font = '12px sans-serif';
      ctx.fillText('GOA, INDIA • AUG 2026', 300, 766);

      ctx.fillStyle = '#FEE101';
      ctx.font = 'bold 14px sans-serif';
      ctx.fillText('#FrameInGoa   #HHGoa2026   @247pmstudio', 300, 828);

      setCardDataUrl(canvas.toDataURL('image/png'));
    };

    const img = new Image();
    img.onload = () => drawCard(img);
    img.src = imageSrc;
  }, [isGenerated, imageSrc, name, handle, role, builderTitle, builderId, headerImg]);

  const handleDownload = () => {
    if (!cardDataUrl || !isGenerated) return;
    const link = document.createElement('a');
    const safeName = name.trim().replace(/\s+/g, '_');
    link.download = `${safeName}_HHGoa_Pass.png`;
    link.href = cardDataUrl;
    link.click();
  };

  const handleShareToTwitter = async () => {
    if (!cardDataUrl) return;

    const shareText =
      `Got my HH Goa 2026 Builder ID ⚡ #FrameInGoa\n` +
      `Build yours: ${window.location.href}`;

    try {
      if (navigator.share && navigator.canShare) {
        const response = await fetch(cardDataUrl);
        const blob = await response.blob();
        const file = new File([blob], 'hhgoa-id.png', { type: 'image/png' });

        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: 'HHGoa 2026 Builder ID',
            text: shareText,
            files: [file],
          });
          return;
        }
      }
    } catch {
      // Fallback to X intent below.
    }

    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
    window.open(tweetUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: '#0B6839',
        backgroundImage: 'url(/assets/sunrise.png)',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'bottom center',
        backgroundSize: '100% auto',
        backgroundAttachment: 'fixed',
      }}
    >
      <header className="w-full px-6 pt-10 pb-6">
        <div className="relative w-full max-w-5xl mx-auto">
          <img
            src="/assets/hacker-house.png"
            alt="HACKER HOUSE GOA"
            className="w-full block"
            style={{ objectFit: 'contain' }}
          />
          <img
            src="/assets/goa-hindi.svg"
            alt="गोवा"
            className="absolute"
            style={{
              width: '13%',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -55%)',
              pointerEvents: 'none',
            }}
          />
        </div>
      </header>

      {!hasStarted ? (
        <div className="px-6 pb-80 text-white flex justify-center">
          <div
            className="w-full max-w-xl rounded-3xl p-10 border text-center shadow-2xl"
            style={{
              background: 'linear-gradient(145deg, rgba(8,77,40,0.92), rgba(6,53,32,0.86))',
              borderColor: '#FEE101',
              backdropFilter: 'blur(8px)',
            }}
          >
            <p className="text-lg sm:text-2xl mb-6 font-semibold" style={{ color: '#FEE101' }}>
              Get your ID
            </p>
            <button
              onClick={() => setHasStarted(true)}
              className="px-10 py-3 rounded-xl font-bold text-lg"
              style={{ background: '#FEE101', color: '#0B6839' }}
            >
              Get your ID
            </button>
          </div>
        </div>
      ) : (
        <div className="text-white p-6 pb-80 flex flex-col items-center justify-center gap-8">
          <form
            onSubmit={handleGenerate}
            className="w-full max-w-md p-7 rounded-3xl shadow-2xl space-y-4 border"
            style={{
              background: 'linear-gradient(145deg, rgba(8,77,40,0.94), rgba(6,53,32,0.9))',
              borderColor: '#FEE101',
              backdropFilter: 'blur(8px)',
            }}
          >
            <h2 className="text-2xl font-bold" style={{ color: '#FEE101' }}>
              HHGoa ID Generator
            </h2>

            <div>
              <label className="block text-sm mb-1" style={{ color: '#FEE101' }}>
                Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full rounded-lg px-3 py-2 border"
                style={{ background: '#063520', borderColor: '#FEE101', color: '#FFFFFF' }}
              />
            </div>

            <div>
              <label className="block text-sm mb-1" style={{ color: '#FEE101' }}>
                X *
              </label>
              <input
                type="text"
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                required
                className="w-full rounded-lg px-3 py-2 border"
                style={{ background: '#063520', borderColor: '#FEE101', color: '#FFFFFF' }}
              />
            </div>

            <div>
              <label className="block text-sm mb-1" style={{ color: '#FEE101' }}>
                Role *
              </label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
                className="w-full rounded-lg px-3 py-2 border"
                style={{ background: '#063520', borderColor: '#FEE101', color: '#FFFFFF' }}
              />
            </div>

            <div>
              <label className="block text-sm mb-1" style={{ color: '#FEE101' }}>
                Builder Title (Auto) *
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={builderTitle}
                  readOnly
                  className="w-full rounded-lg px-3 py-2 border"
                  style={{ background: '#063520', borderColor: '#FEE101', color: '#FFFFFF' }}
                />
                <button
                  type="button"
                  onClick={() => setBuilderTitle(generateBuilderTitle())}
                  className="px-3 rounded-lg font-semibold"
                  style={{ background: '#FEE101', color: '#0B6839' }}
                >
                  New
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm mb-1" style={{ color: '#FEE101' }}>
                Builder ID *
              </label>
              <input
                type="text"
                value={builderId}
                onChange={(e) => setBuilderId(e.target.value)}
                required
                className="w-full rounded-lg px-3 py-2 border"
                style={{ background: '#063520', borderColor: '#FEE101', color: '#FFFFFF' }}
              />
            </div>

            <div>
              <label className="block text-sm mb-1" style={{ color: '#FEE101' }}>
                Upload Photo *
              </label>
              <input
                type="file"
                accept="image/*,.heic,.heif"
                onChange={handleImageUpload}
                required
                className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 cursor-pointer"
                style={{ backgroundColor: '#063520', color: '#FEE101' }}
              />
            </div>

            {formError ? (
              <p className="text-sm font-semibold" style={{ color: '#FCA5A5' }}>
                {formError}
              </p>
            ) : null}

            <button
              type="submit"
              className="w-full mt-2 font-semibold py-3 rounded-xl shadow-lg"
              style={{ background: '#FEE101', color: '#0B6839' }}
            >
              Generate ID Card
            </button>
          </form>

          {isGenerated ? (
            <div
              className="flex flex-col items-center rounded-3xl border p-6 w-full max-w-md shadow-2xl"
              style={{
                background: 'linear-gradient(145deg, rgba(8,77,40,0.94), rgba(6,53,32,0.9))',
                borderColor: '#FEE101',
                backdropFilter: 'blur(8px)',
              }}
            >
              <h3
                className="text-sm font-semibold mb-3 uppercase tracking-wider"
                style={{ color: '#FEE101' }}
              >
                Your HHGoa ID Card
              </h3>
              <canvas
                ref={canvasRef}
                className="w-[320px] h-[480px] sm:w-[400px] sm:h-[600px] rounded-2xl shadow-2xl border"
                style={{ borderColor: '#FEE101' }}
              />
              <button
                onClick={handleDownload}
                className="mt-4 w-full max-w-xs font-semibold py-3 rounded-xl shadow-lg"
                style={{ background: '#FEE101', color: '#0B6839' }}
              >
                Download Card Image (.PNG)
              </button>
              <button
                onClick={handleShareToTwitter}
                className="mt-3 w-full max-w-xs font-semibold py-3 rounded-xl shadow-lg flex items-center justify-center gap-2"
                style={{ background: '#0A3A24', color: '#FEE101', border: '1px solid #FEE101' }}
              >
                <span aria-hidden="true">𝕏</span>
                <span>Share on Twitter (#FrameInGoa)</span>
              </button>
            </div>
          ) : (
            <div
              className="w-full max-w-md rounded-3xl p-6 border text-center"
              style={{
                background: 'linear-gradient(145deg, rgba(8,77,40,0.92), rgba(6,53,32,0.86))',
                borderColor: '#FEE101',
              }}
            >
              <p style={{ color: '#FEE101' }}>
                Fill all mandatory fields to preview and download your ID card.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
