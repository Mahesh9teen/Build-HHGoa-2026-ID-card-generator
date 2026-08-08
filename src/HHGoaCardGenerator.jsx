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

function cleanValue(value, maxLength = 80) {
  return (value || '').trim().replace(/\s+/g, ' ').slice(0, maxLength);
}

function extractHandleFromUrl(rawUrl) {
  try {
    const normalized = rawUrl.startsWith('http') ? rawUrl : `https://${rawUrl}`;
    const url = new URL(normalized);
    const path = url.pathname.replace(/^\/+|\/+$/g, '');
    return path || url.hostname.replace(/^www\./, '');
  } catch {
    return cleanValue(rawUrl, 60);
  }
}

async function createTinyPhotoPayload(imageSrc) {
  return new Promise((resolve) => {
    if (!imageSrc) {
      resolve('');
      return;
    }

    const img = new Image();
    img.onload = () => {
      const size = 56;
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      const scale = Math.max(size / img.width, size / img.height);
      const w = img.width * scale;
      const h = img.height * scale;
      const x = (size - w) / 2;
      const y = (size - h) / 2;
      ctx.drawImage(img, x, y, w, h);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.45);
      resolve(dataUrl.replace(/^data:image\/jpeg;base64,/, ''));
    };
    img.onerror = () => resolve('');
    img.src = imageSrc;
  });
}

function drawFittedText(ctx, text, x, y, maxWidth, startSize, minSize, family, weight = 'bold') {
  let fontSize = startSize;
  while (fontSize > minSize) {
    ctx.font = `${weight} ${fontSize}px ${family}`;
    if (ctx.measureText(text).width <= maxWidth) break;
    fontSize -= 1;
  }
  ctx.fillText(text, x, y);
}

function drawFittedTextCentered(ctx, text, centerX, y, maxWidth, startSize, minSize, family, weight = 'bold') {
  let fontSize = startSize;
  while (fontSize > minSize) {
    ctx.font = `${weight} ${fontSize}px ${family}`;
    if (ctx.measureText(text).width <= maxWidth) break;
    fontSize -= 1;
  }
  ctx.fillText(text, centerX, y);
}

function getScannedProfileFromUrl() {
  const params = new URLSearchParams(window.location.search);
  if (params.get('profile') !== '1') return null;
  return {
    name: params.get('n') || '',
    role: params.get('r') || '',
    title: params.get('t') || '',
    builderId: params.get('id') || '',
    twitter: params.get('x') || '',
    github: params.get('gh') || '',
    linkedin: params.get('li') || '',
    instagram: params.get('ig') || '',
    email: params.get('e') || '',
    contact: params.get('c') || '',
    location: params.get('l') || '',
    skills: params.get('s') || '',
    photo: params.get('p') || '',
  };
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

function loadImage(src) {
  return new Promise((resolve) => {
    if (!src) {
      resolve(null);
      return;
    }
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

function renderWideCard(ctx, { headerImg, profileImg, qrImg, name, role, builderTitle, builderId, location }) {
  const width = 1000;
  const height = 620;

  const bgGradient = ctx.createLinearGradient(0, 0, width, height);
  bgGradient.addColorStop(0, '#0B6839');
  bgGradient.addColorStop(0.55, '#0A5E34');
  bgGradient.addColorStop(1, '#07311E');
  ctx.fillStyle = bgGradient;
  ctx.fillRect(0, 0, width, height);

  const halo = ctx.createRadialGradient(220, 300, 40, 220, 300, 270);
  halo.addColorStop(0, 'rgba(254,225,1,0.2)');
  halo.addColorStop(1, 'rgba(254,225,1,0)');
  ctx.fillStyle = halo;
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = 'rgba(254,225,1,0.08)';
  ctx.fillRect(30, 30, 940, 560);
  ctx.strokeStyle = '#FEE101';
  ctx.lineWidth = 5;
  ctx.strokeRect(20, 20, 960, 580);
  ctx.strokeStyle = '#F9DC01';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(30, 30, 940, 560);

  if (headerImg) {
    const hhWidth = 560;
    const hhHeight = hhWidth * (headerImg.height / headerImg.width);
    ctx.drawImage(headerImg, 40, 56, hhWidth, hhHeight);
  } else {
    ctx.fillStyle = '#FEE101';
    ctx.font = 'bold 64px serif';
    ctx.textAlign = 'left';
    ctx.fillText('HACKER HOUSE', 44, 118);
  }

  ctx.fillStyle = '#FEE101';
  ctx.font = '13px monospace';
  ctx.textAlign = 'left';
  ctx.fillText('GOA, INDIA  •  28 - 31 OCT 2026', 44, 182);
  ctx.textAlign = 'right';
  ctx.fillText('2:47 PM STUDIO', 956, 182);

  if (profileImg) {
    drawCircularPhoto(ctx, profileImg, 220, 335, 260);
  } else {
    ctx.save();
    ctx.beginPath();
    ctx.arc(220, 335, 130, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    ctx.fillStyle = '#0A3A24';
    ctx.fillRect(90, 205, 260, 260);
    ctx.restore();
    ctx.fillStyle = '#FEE101';
    ctx.font = 'bold 64px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('?', 220, 356);
  }

  ctx.beginPath();
  ctx.arc(220, 335, 133, 0, Math.PI * 2);
  ctx.strokeStyle = '#FEE101';
  ctx.lineWidth = 4;
  ctx.stroke();

  const safeName = (name || 'YOUR NAME').toUpperCase();
  const safeRole = (role || 'ROLE').toUpperCase();
  const safeTitle = (builderTitle || 'BUILDER TITLE').toUpperCase();
  const safeBuilderId = builderId || '#HH-GOA-0000';
  const safeLocation = (location || 'GOA, INDIA').toUpperCase();

  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'left';
  drawFittedText(ctx, safeName, 410, 282, 385, 48, 28, 'sans-serif');

  ctx.fillStyle = '#FEE101';
  drawFittedText(ctx, safeRole, 410, 332, 385, 30, 18, 'sans-serif');

  ctx.fillStyle = '#D1FAE5';
  drawFittedText(ctx, safeTitle, 410, 372, 385, 26, 16, 'sans-serif');

  ctx.fillStyle = '#0A3A24';
  ctx.fillRect(500, 404, 260, 146);
  ctx.strokeStyle = '#FEE101';
  ctx.strokeRect(500, 404, 260, 146);
  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'center';
  ctx.font = 'bold 16px monospace';
  ctx.fillText('BUILDER ID', 630, 438);
  ctx.fillStyle = '#F9DC01';
  drawFittedTextCentered(ctx, safeBuilderId, 630, 492, 220, 38, 22, 'monospace');
  ctx.fillStyle = '#D1FAE5';
  drawFittedTextCentered(ctx, safeLocation, 630, 528, 220, 14, 11, 'sans-serif');

  if (qrImg) {
    ctx.imageSmoothingEnabled = false;
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(786, 372, 178, 178);
    ctx.drawImage(qrImg, 794, 380, 162, 162);
    ctx.imageSmoothingEnabled = true;
    ctx.fillStyle = '#FEE101';
    ctx.font = 'bold 13px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('SCAN FOR DETAILS', 875, 364);
  }
}

export default function HHGoaCardGenerator() {
  const [hasStarted, setHasStarted] = useState(false);
  const [showResultPage, setShowResultPage] = useState(false);
  const [scannedProfile] = useState(() => getScannedProfileFromUrl());
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
  const [generatedProfileUrl, setGeneratedProfileUrl] = useState('');
  const [cardDataUrl, setCardDataUrl] = useState('');
  const [formError, setFormError] = useState('');

  const canvasRef = useRef(null);
  const scannedCanvasRef = useRef(null);

  useEffect(() => {
    const img = new Image();
    img.onload = () => setHeaderImg(img);
    img.src = assetPath('hacker-house.png');
  }, []);

  const isContactValid = /^\d{10}$/.test(contact.trim());
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
    isContactValid &&
    location.trim() &&
    skills.trim() &&
    imageSrc;

  useEffect(() => {
    if (!isFormValid) {
      setQrCodeSrc('');
      setGeneratedProfileUrl('');
      return;
    }

    let cancelled = false;

    async function buildQr() {
      try {
        const qrParams = new URLSearchParams({
          profile: '1',
          n: cleanValue(name, 36),
          r: cleanValue(role, 30),
          t: cleanValue(builderTitle, 32),
          id: cleanValue(builderId, 24),
          x: cleanValue(extractHandleFromUrl(twitterUrl), 24),
          gh: cleanValue(extractHandleFromUrl(githubUrl), 24),
          li: cleanValue(extractHandleFromUrl(linkedinUrl), 24),
          ig: cleanValue(extractHandleFromUrl(instagramUrl), 24),
          e: cleanValue(email, 40),
          c: cleanValue(contact, 18),
          l: cleanValue(location, 22),
          s: cleanValue(skills, 30),
        });
        const payload = `${window.location.origin}${import.meta.env.BASE_URL}?${qrParams.toString()}`;
        if (!cancelled) setGeneratedProfileUrl(payload);

        const { default: QRCode } = await import('qrcode');
        const dataUrl = await QRCode.toDataURL(payload, {
          width: 220,
          margin: 6,
          errorCorrectionLevel: 'M',
          color: { dark: '#000000', light: '#ffffff' },
        });
        if (!cancelled) setQrCodeSrc(dataUrl);
      } catch {
        if (!cancelled) {
          setQrCodeSrc('');
          setGeneratedProfileUrl('');
        }
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
    imageSrc,
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
    if (!showResultPage) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = 1000;
    canvas.height = 620;

    const drawCard = (profileImg, qrImg) => {
      renderWideCard(ctx, {
        headerImg,
        profileImg,
        qrImg,
        name: name.trim(),
        role: role.trim(),
        builderTitle: builderTitle.trim(),
        builderId: builderId.trim(),
        location: location.trim(),
      });
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
    showResultPage,
    imageSrc,
    headerImg,
    qrCodeSrc,
    name,
    role,
    builderTitle,
    builderId,
    location,
  ]);

  useEffect(() => {
    if (!scannedProfile) return;
    const canvas = scannedCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = 1000;
    canvas.height = 620;

    let cancelled = false;

    async function drawScannedCard() {
      const profileSrc = scannedProfile.photo ? `data:image/jpeg;base64,${scannedProfile.photo}` : '';
      const [profileImg, qrImgSrc] = await Promise.all([
        loadImage(profileSrc),
        (async () => {
          try {
            const { default: QRCode } = await import('qrcode');
            return QRCode.toDataURL(window.location.href, {
              width: 256,
              margin: 4,
              errorCorrectionLevel: 'L',
              color: { dark: '#000000', light: '#ffffff' },
            });
          } catch {
            return '';
          }
        })(),
      ]);
      const qrImg = await loadImage(qrImgSrc);
      if (cancelled) return;
      renderWideCard(ctx, {
        headerImg,
        profileImg,
        qrImg,
        name: scannedProfile.name,
        role: scannedProfile.role,
        builderTitle: scannedProfile.title,
        builderId: scannedProfile.builderId,
        location: scannedProfile.location,
      });
    }

    drawScannedCard();
    return () => {
      cancelled = true;
    };
  }, [scannedProfile, headerImg]);

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

    const shareText = `Got my HH Goa 2026 Builder ID ⚡ #FrameInGoa\nBuild yours: ${
      generatedProfileUrl || window.location.href
    }`;
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

  const handleGenerateResultPage = (e) => {
    e.preventDefault();
    if (!isFormValid) {
      if (!isContactValid) {
        setFormError('Contact number must be exactly 10 digits.');
      } else {
        setFormError('Please fill all details and upload a photo.');
      }
      setShowResultPage(false);
      return;
    }
    setFormError('');
    setShowResultPage(true);
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

      {scannedProfile ? (
        <div className="px-6 pb-20 text-white flex justify-center">
          <div
            className="w-full max-w-6xl rounded-3xl p-8 border shadow-2xl"
            style={{
              background: 'linear-gradient(145deg, rgba(8,77,40,0.94), rgba(6,53,32,0.9))',
              borderColor: '#FEE101',
            }}
          >
            <h2 className="text-2xl font-bold mb-4" style={{ color: '#FEE101' }}>
              HHGoa 2026 Profile
            </h2>
            <div className="grid grid-cols-1 gap-6 items-start">
              <div className="flex justify-center">
                <canvas
                  ref={scannedCanvasRef}
                  className="w-[360px] h-[220px] sm:w-[760px] sm:h-[470px] rounded-2xl shadow-2xl border"
                  style={{ borderColor: '#FEE101' }}
                />
              </div>
              <div className="rounded-2xl p-4 border" style={{ borderColor: '#FEE101' }}>
                <h3 className="text-lg font-bold mb-3" style={{ color: '#FEE101' }}>Scanned User Details</h3>
                <p><strong>Name:</strong> {scannedProfile.name}</p>
                <p><strong>Role:</strong> {scannedProfile.role}</p>
                <p><strong>Builder Title:</strong> {scannedProfile.title}</p>
                <p><strong>Builder ID:</strong> {scannedProfile.builderId}</p>
                <p><strong>Twitter URL:</strong> {scannedProfile.twitter}</p>
                <p><strong>GitHub:</strong> {scannedProfile.github}</p>
                <p><strong>LinkedIn:</strong> {scannedProfile.linkedin}</p>
                <p><strong>Instagram:</strong> {scannedProfile.instagram}</p>
                <p><strong>Email:</strong> {scannedProfile.email}</p>
                <p><strong>Contact:</strong> {scannedProfile.contact}</p>
                <p><strong>Location:</strong> {scannedProfile.location}</p>
                <p><strong>Skills:</strong> {scannedProfile.skills}</p>
              </div>
            </div>
            <button
              onClick={() => (window.location.href = `${window.location.origin}${import.meta.env.BASE_URL}`)}
              className="mt-5 px-6 py-3 rounded-xl font-bold"
              style={{ background: '#FEE101', color: '#0B6839' }}
            >
              Open Generator
            </button>
          </div>
        </div>
      ) : !hasStarted ? (
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
      ) : !showResultPage ? (
        <div className="text-white p-6 pb-80 flex flex-col items-center justify-center gap-8">
          <form
            onSubmit={handleGenerateResultPage}
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
              onChange={(e) => setContact(e.target.value.replace(/\D/g, '').slice(0, 10))}
              inputMode="numeric"
              maxLength={10}
              pattern="[0-9]{10}"
              title="Enter exactly 10 digits"
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

          <button
            type="submit"
            className="w-full mt-2 font-semibold py-3 rounded-xl shadow-lg"
            style={{ background: '#FEE101', color: '#0B6839' }}
          >
            Generate ID Card
          </button>
        </form>
        </div>
      ) : (
        <div className="text-white p-6 pb-40 flex flex-col items-center justify-center gap-8">
          <div
            className="w-full max-w-5xl rounded-3xl p-6 border shadow-2xl"
            style={{
              background: 'linear-gradient(145deg, rgba(8,77,40,0.94), rgba(6,53,32,0.9))',
              borderColor: '#FEE101',
              backdropFilter: 'blur(8px)',
            }}
          >
            <h2 className="text-2xl font-bold mb-4" style={{ color: '#FEE101' }}>
              Your Generated ID Card
            </h2>
            <div className="grid grid-cols-1 gap-6 items-start">
              <div className="flex flex-col items-center">
                <canvas
                  ref={canvasRef}
                  className="w-[360px] h-[220px] sm:w-[760px] sm:h-[470px] rounded-2xl shadow-2xl border"
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

              <div className="rounded-2xl p-4 border" style={{ borderColor: '#FEE101' }}>
                <h3 className="text-lg font-bold mb-3" style={{ color: '#FEE101' }}>
                  User Details
                </h3>
                <p><strong>Name:</strong> {name}</p>
                <p><strong>Role:</strong> {role}</p>
                <p><strong>Builder Title:</strong> {builderTitle}</p>
                <p><strong>Builder ID:</strong> {builderId}</p>
                <p><strong>Twitter URL:</strong> {twitterUrl}</p>
                <p><strong>GitHub:</strong> {githubUrl}</p>
                <p><strong>LinkedIn:</strong> {linkedinUrl}</p>
                <p><strong>Instagram:</strong> {instagramUrl}</p>
                <p><strong>Email:</strong> {email}</p>
                <p><strong>Contact:</strong> {contact}</p>
                <p><strong>Location:</strong> {location}</p>
                <p><strong>Skills:</strong> {skills}</p>
                <button
                  onClick={() => setShowResultPage(false)}
                  className="mt-4 px-4 py-2 rounded-lg font-semibold"
                  style={{ background: '#FEE101', color: '#0B6839' }}
                >
                  Edit Details
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
