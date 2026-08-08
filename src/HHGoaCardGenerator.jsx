import React, { useEffect, useRef, useState } from 'react';

const TITLE_PREFIXES = ['Chain', 'AI', 'Protocol', 'Design', 'Data', 'Infra', 'Growth'];
const TITLE_SUFFIXES = ['Alchemist', 'Wizard', 'Ranger', 'Architect', 'Pilot', 'Ninja', 'Captain'];

function randomItem(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function generateBuilderTitle() {
  return `${randomItem(TITLE_PREFIXES)} ${randomItem(TITLE_SUFFIXES)}`;
}

function assetPath(fileName) {
  return `${import.meta.env.BASE_URL}assets/${fileName}`;
}

function drawCircularPhoto(ctx, img, centerX, centerY, diameter) {
  const baseScale = Math.max(diameter / img.width, diameter / img.height);
  const drawWidth = img.width * baseScale;
  const drawHeight = img.height * baseScale;
  const drawX = centerX - drawWidth / 2;
  const drawY = centerY - drawHeight / 2;

  ctx.save();
  ctx.beginPath();
  ctx.arc(centerX, centerY, diameter / 2, 0, Math.PI * 2);
  ctx.closePath();
  ctx.clip();
  ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
  ctx.restore();
}

export default function HHGoaCardGenerator() {
  const [hasStarted, setHasStarted] = useState(false);
  const [name, setName] = useState('');
  const [twitterUrl, setTwitterUrl] = useState('');
  const [role, setRole] = useState('');
  const [builderTitle, setBuilderTitle] = useState(generateBuilderTitle);
  const [builderId, setBuilderId] = useState(
    '#HH-GOA-' + Math.floor(1000 + Math.random() * 9000)
  );
  const [githubUrl, setGithubUrl] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [instagramUrl, setInstagramUrl] = useState('');
  const [email, setEmail] = useState('');
  const [contact, setContact] = useState('');
  const [location, setLocation] = useState('');
  const [skills, setSkills] = useState('');

  const [imageSrc, setImageSrc] = useState(null);
  const [headerImg, setHeaderImg] = useState(null);
  const [qrCodeSrc, setQrCodeSrc] = useState('');
  const [cardDataUrl, setCardDataUrl] = useState('');
  const [formError, setFormError] = useState('');

  const canvasRef = useRef(null);

  useEffect(() => {
    const img = new Image();
    img.onload = () => setHeaderImg(img);
    img.src = assetPath('hacker-house.png');
  }, []);

  const isFormValid =
    name.trim() &&
    twitterUrl.trim() &&
    role.trim() &&
    builderTitle.trim() &&
    builderId.trim() &&
    githubUrl.trim() &&
    linkedinUrl.trim() &&
    instagramUrl.trim() &&
    email.trim() &&
    contact.trim() &&
    location.trim() &&
    skills.trim() &&
    imageSrc;

  useEffect(() => {
    if (!isFormValid) {
      setQrCodeSrc('');
      return;
    }

    let cancelled = false;
    const payload = JSON.stringify(
      {
        name: name.trim(),
        twitterUrl: twitterUrl.trim(),
        role: role.trim(),
        builderTitle: builderTitle.trim(),
        builderId: builderId.trim(),
        githubUrl: githubUrl.trim(),
        linkedinUrl: linkedinUrl.trim(),
        instagramUrl: instagramUrl.trim(),
        email: email.trim(),
        contact: contact.trim(),
        location: location.trim(),
        skills: skills.trim(),
      },
      null,
      0
    );

    async function buildQr() {
      try {
        const { default: QRCode } = await import('qrcode');
        const dataUrl = await QRCode.toDataURL(payload, {
          width: 140,
          margin: 1,
          errorCorrectionLevel: 'M',
          color: { dark: '#0A3A24', light: '#ffffff' },
        });
        if (!cancelled) setQrCodeSrc(dataUrl);
      } catch {
        if (!cancelled) setQrCodeSrc('');
      }
    }

    buildQr();
    return () => {
      cancelled = true;
    };
  }, [
    isFormValid,
    name,
    twitterUrl,
    role,
    builderTitle,
    builderId,
    githubUrl,
    linkedinUrl,
    instagramUrl,
    email,
    contact,
    location,
    skills,
  ]);

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
        const { default: heic2any } = await import('heic2any');
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

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = 600;
    canvas.height = 900;

    const drawCard = (profileImg, qrImg) => {
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

      if (profileImg) {
        drawCircularPhoto(ctx, profileImg, 300, 320, 216);
      } else {
        ctx.save();
        ctx.beginPath();
        ctx.arc(300, 320, 108, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();
        ctx.fillStyle = '#0A3A24';
        ctx.fillRect(192, 212, 216, 216);
        ctx.restore();
        ctx.fillStyle = '#FEE101';
        ctx.font = 'bold 64px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('?', 300, 342);
      }

      ctx.beginPath();
      ctx.arc(300, 320, 111, 0, Math.PI * 2);
      ctx.strokeStyle = '#FEE101';
      ctx.lineWidth = 4;
      ctx.stroke();

      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 40px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(name.trim() || 'YOUR NAME', 300, 500);

      ctx.fillStyle = '#FEE101';
      ctx.font = 'bold 22px sans-serif';
      ctx.fillText((role.trim() || 'ROLE').toUpperCase(), 300, 540);

      ctx.fillStyle = '#D1FAE5';
      ctx.font = 'bold 20px sans-serif';
      ctx.fillText((builderTitle.trim() || 'BUILDER TITLE').toUpperCase(), 300, 578);

      ctx.fillStyle = '#0A3A24';
      ctx.fillRect(80, 620, 440, 130);
      ctx.strokeStyle = '#FEE101';
      ctx.strokeRect(80, 620, 440, 130);
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '14px monospace';
      ctx.fillText('BUILDER ID', 300, 655);
      ctx.fillStyle = '#F9DC01';
      ctx.font = 'bold 30px monospace';
      ctx.fillText(builderId.trim() || '#HH-GOA-0000', 300, 702);
      ctx.fillStyle = '#D1FAE5';
      ctx.font = '12px sans-serif';
      ctx.fillText((location.trim() || 'GOA, INDIA').toUpperCase(), 300, 730);

      if (qrImg) {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(430, 760, 136, 136);
        ctx.drawImage(qrImg, 438, 768, 120, 120);
        ctx.fillStyle = '#FEE101';
        ctx.font = 'bold 11px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('SCAN FOR DETAILS', 498, 858);
      }

      setCardDataUrl(canvas.toDataURL('image/png'));
    };

    const drawWithQr = (profileImg) => {
      if (qrCodeSrc) {
        const qrImg = new Image();
        qrImg.onload = () => drawCard(profileImg, qrImg);
        qrImg.src = qrCodeSrc;
      } else {
        drawCard(profileImg, null);
      }
    };

    if (imageSrc) {
      const profileImg = new Image();
      profileImg.onload = () => drawWithQr(profileImg);
      profileImg.src = imageSrc;
    } else {
      drawWithQr(null);
    }
  }, [
    imageSrc,
    headerImg,
    qrCodeSrc,
    name,
    role,
    builderTitle,
    builderId,
    location,
  ]);

  const handleDownload = () => {
    if (!isFormValid || !cardDataUrl) {
      setFormError('Please fill all details and upload a photo before download.');
      return;
    }
    const link = document.createElement('a');
    const safeName = (name.trim() || 'builder').replace(/\s+/g, '_');
    link.download = `${safeName}_HHGoa_Pass.png`;
    link.href = cardDataUrl;
    link.click();
  };

  const handleShareToTwitter = async () => {
    if (!isFormValid || !cardDataUrl) {
      setFormError('Please fill all details and upload a photo before sharing.');
      return;
    }

    const shareText = `Got my HH Goa 2026 Builder ID ⚡ #FrameInGoa\nBuild yours: ${window.location.href}`;
    try {
      if (navigator.share && navigator.canShare) {
        const response = await fetch(cardDataUrl);
        const blob = await response.blob();
        const file = new File([blob], 'hhgoa-card.png', { type: 'image/png' });
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: 'HHGoa 2026',
            text: shareText,
            files: [file],
          });
          return;
        }
      }
    } catch {
      // Fallback below.
    }
    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
    window.open(tweetUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: '#0B6839',
        backgroundImage: `url(${assetPath('sunrise.png')})`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'bottom center',
        backgroundSize: '100% auto',
        backgroundAttachment: 'fixed',
      }}
    >
      <header className="w-full px-6 pt-10 pb-6">
        <div className="relative w-full max-w-5xl mx-auto">
          <img
            src={assetPath('hacker-house.png')}
            alt="HACKER HOUSE GOA"
            className="w-full block"
            style={{ objectFit: 'contain' }}
          />
          <img
            src={assetPath('goa-hindi.svg')}
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
              Generate your ID card
            </p>
            <button
              onClick={() => setHasStarted(true)}
              className="px-10 py-3 rounded-xl font-bold text-lg"
              style={{ background: '#FEE101', color: '#0B6839' }}
            >
              Get Your ID Card
            </button>
          </div>
        </div>
      ) : (
        <div className="text-white p-6 pb-80 flex flex-col items-center justify-center gap-8">
          <form
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
              className="w-full rounded-lg px-3 py-2 border"
              style={{ background: '#063520', borderColor: '#FEE101', color: '#FFFFFF' }}
            />
          </div>

          <div>
            <label className="block text-sm mb-1" style={{ color: '#FEE101' }}>
              Twitter URL *
            </label>
            <input
              type="url"
              value={twitterUrl}
              onChange={(e) => setTwitterUrl(e.target.value)}
              className="w-full rounded-lg px-3 py-2 border"
              style={{ background: '#063520', borderColor: '#FEE101', color: '#FFFFFF' }}
              placeholder="https://twitter.com/username"
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
              className="w-full rounded-lg px-3 py-2 border"
              style={{ background: '#063520', borderColor: '#FEE101', color: '#FFFFFF' }}
            />
          </div>

          <div>
            <label className="block text-sm mb-1" style={{ color: '#FEE101' }}>
              Builder Title *
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={builderTitle}
                onChange={(e) => setBuilderTitle(e.target.value)}
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
              className="w-full rounded-lg px-3 py-2 border"
              style={{ background: '#063520', borderColor: '#FEE101', color: '#FFFFFF' }}
            />
          </div>

          <div>
            <label className="block text-sm mb-1" style={{ color: '#FEE101' }}>
              GitHub URL *
            </label>
            <input
              type="url"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              className="w-full rounded-lg px-3 py-2 border"
              style={{ background: '#063520', borderColor: '#FEE101', color: '#FFFFFF' }}
            />
          </div>

          <div>
            <label className="block text-sm mb-1" style={{ color: '#FEE101' }}>
              LinkedIn URL *
            </label>
            <input
              type="url"
              value={linkedinUrl}
              onChange={(e) => setLinkedinUrl(e.target.value)}
              className="w-full rounded-lg px-3 py-2 border"
              style={{ background: '#063520', borderColor: '#FEE101', color: '#FFFFFF' }}
            />
          </div>

          <div>
            <label className="block text-sm mb-1" style={{ color: '#FEE101' }}>
              Instagram URL *
            </label>
            <input
              type="url"
              value={instagramUrl}
              onChange={(e) => setInstagramUrl(e.target.value)}
              className="w-full rounded-lg px-3 py-2 border"
              style={{ background: '#063520', borderColor: '#FEE101', color: '#FFFFFF' }}
            />
          </div>

          <div>
            <label className="block text-sm mb-1" style={{ color: '#FEE101' }}>
              Email *
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg px-3 py-2 border"
              style={{ background: '#063520', borderColor: '#FEE101', color: '#FFFFFF' }}
            />
          </div>

          <div>
            <label className="block text-sm mb-1" style={{ color: '#FEE101' }}>
              Contact *
            </label>
            <input
              type="text"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              className="w-full rounded-lg px-3 py-2 border"
              style={{ background: '#063520', borderColor: '#FEE101', color: '#FFFFFF' }}
            />
          </div>

          <div>
            <label className="block text-sm mb-1" style={{ color: '#FEE101' }}>
              Location *
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full rounded-lg px-3 py-2 border"
              style={{ background: '#063520', borderColor: '#FEE101', color: '#FFFFFF' }}
            />
          </div>

          <div>
            <label className="block text-sm mb-1" style={{ color: '#FEE101' }}>
              Skills *
            </label>
            <input
              type="text"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
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
              className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 cursor-pointer"
              style={{ backgroundColor: '#063520', color: '#FEE101' }}
            />
          </div>

          {formError ? (
            <p className="text-sm font-semibold" style={{ color: '#FCA5A5' }}>
              {formError}
            </p>
          ) : null}
        </form>

        <div
          className="flex flex-col items-center rounded-3xl border p-6 w-full max-w-md shadow-2xl"
          style={{
            background: 'linear-gradient(145deg, rgba(8,77,40,0.94), rgba(6,53,32,0.9))',
            borderColor: '#FEE101',
            backdropFilter: 'blur(8px)',
          }}
        >
          <h3 className="text-sm font-semibold mb-3 uppercase tracking-wider" style={{ color: '#FEE101' }}>
            Live ID Preview
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
      </div>
      )}
    </div>
  );
}
