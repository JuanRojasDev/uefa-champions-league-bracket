import React, { forwardRef, useEffect, useMemo, useRef, useState } from 'react';
import Match from './Match';
import Team from './Team';
import trophyImage from '../assets/trophy.png';
import backgroundImage from '../assets/background.jpg';

const logoUrl = (clubId) => `https://img.uefa.com/imgml/TP/teams/logos/70x70/${clubId}.png`;

/** Texto de la pastilla bajo el trofeo (web + export PNG) */
const CAMPEON_PILL_TEXT = '¡CAMPEON! 👑';

const teams = {
  paris: { id: 'paris', name: 'PARIS', initials: 'PSG', logo: logoUrl(52747), colors: ['#004170', '#e30613'] },
  chelsea: { id: 'chelsea', name: 'CHELSEA', initials: 'CHE', logo: logoUrl(52914), colors: ['#034694', '#ffffff'] },
  galatasaray: { id: 'galatasaray', name: 'GALATASARAY', initials: 'GS', logo: logoUrl(50067), colors: ['#fdb913', '#a90432'] },
  liverpool: { id: 'liverpool', name: 'LIVERPOOL', initials: 'LFC', logo: logoUrl(7889), colors: ['#c8102e', '#00b2a9'] },
  realMadrid: { id: 'realMadrid', name: 'REAL MADRID', initials: 'RMA', logo: logoUrl(50051), colors: ['#ffffff', '#febe10'] },
  manCity: { id: 'manCity', name: 'MAN CITY', initials: 'MCI', logo: logoUrl(52919), colors: ['#6cabdd', '#1c2c5b'] },
  atalanta: { id: 'atalanta', name: 'ATALANTA', initials: 'ATA', logo: logoUrl(52816), colors: ['#0057b8', '#111111'] },
  bayern: { id: 'bayern', name: 'BAYERN MÜNCHEN', initials: 'FCB', logo: logoUrl(50037), colors: ['#dc052d', '#0066b2'] },
  newcastle: { id: 'newcastle', name: 'NEWCASTLE', initials: 'NEW', logo: logoUrl(59324), colors: ['#241f20', '#ffffff'] },
  barcelona: { id: 'barcelona', name: 'BARCELONA', initials: 'BAR', logo: logoUrl(50080), colors: ['#a50044', '#004d98'] },
  atleti: { id: 'atleti', name: 'ATLETI', initials: 'ATM', logo: logoUrl(50124), colors: ['#cb3524', '#ffffff'] },
  tottenham: { id: 'tottenham', name: 'TOTTENHAM', initials: 'TOT', logo: logoUrl(1652), colors: ['#132257', '#ffffff'] },
  bodo: { id: 'bodo', name: 'BODØ/GLIMT', initials: 'B/G', logo: logoUrl(2601994), colors: ['#f7d117', '#111111'] },
  sporting: { id: 'sporting', name: 'SPORTING CP', initials: 'SCP', logo: logoUrl(50149), colors: ['#008057', '#ffffff'] },
  leverkusen: { id: 'leverkusen', name: 'LEVERKUSEN', initials: 'B04', logo: logoUrl(50109), colors: ['#e32221', '#111111'] },
  arsenal: { id: 'arsenal', name: 'ARSENAL', initials: 'ARS', logo: logoUrl(52280), colors: ['#ef0107', '#f9d616'] },
};

const initialMatches = {
  l16a: ['paris', 'chelsea'],
  l16b: ['galatasaray', 'liverpool'],
  l16c: ['realMadrid', 'manCity'],
  l16d: ['atalanta', 'bayern'],
  r16a: ['newcastle', 'barcelona'],
  r16b: ['atleti', 'tottenham'],
  r16c: ['bodo', 'sporting'],
  r16d: ['leverkusen', 'arsenal'],
};

const slots = [
  // R16 - Octavos de final (izquierda)
  { id: 'l16a', label: 'R16', side: 'left', round: 'r16', row: 0, col: 0 },
  { id: 'l16b', label: 'R16', side: 'left', round: 'r16', row: 1, col: 0 },
  { id: 'l16c', label: 'R16', side: 'left', round: 'r16', row: 2, col: 0 },
  { id: 'l16d', label: 'R16', side: 'left', round: 'r16', row: 3, col: 0 },
  // QF - Cuartos de final (izquierda)
  { id: 'lqf1', label: 'QF', side: 'left', round: 'qf', row: 0.5, col: 1, sources: ['l16a', 'l16b'] },
  { id: 'lqf2', label: 'QF', side: 'left', round: 'qf', row: 2.5, col: 1, sources: ['l16c', 'l16d'] },
  // SF - Semifinales (une los dos QF de cada mitad; referencia diseño “después de QF”)
  { id: 'lsf', label: 'SF', side: 'left', round: 'sf', row: 1.5, col: 2, sources: ['lqf1', 'lqf2'] },
  { id: 'rsf', label: 'SF', side: 'right', round: 'sf', row: 1.5, col: 4, sources: ['rqf1', 'rqf2'] },
  // QF - Cuartos de final (derecha)
  { id: 'rqf1', label: 'QF', side: 'right', round: 'qf', row: 0.5, col: 5, sources: ['r16a', 'r16b'] },
  { id: 'rqf2', label: 'QF', side: 'right', round: 'qf', row: 2.5, col: 5, sources: ['r16c', 'r16d'] },
  // R16 - Octavos de final (derecha)
  { id: 'r16a', label: 'R16', side: 'right', round: 'r16', row: 0, col: 6 },
  { id: 'r16b', label: 'R16', side: 'right', round: 'r16', row: 1, col: 6 },
  { id: 'r16c', label: 'R16', side: 'right', round: 'r16', row: 2, col: 6 },
  { id: 'r16d', label: 'R16', side: 'right', round: 'r16', row: 3, col: 6 },
  // Campeón: un solo hueco entre ganadores de SF (elegible solo cuando ambos semifinalistas están definidos)
  { id: 'champion', label: '', side: 'center', round: 'champion', col: 3, sources: ['lsf', 'rsf'] },
];

const sourceMap = Object.fromEntries(slots.filter((slot) => slot.sources).map((slot) => [slot.id, slot.sources]));

const initialTeamCards = [
  // Lado izquierdo
  { id: 'paris', side: 'left', pair: 0, position: 0, tone: 'light' },
  { id: 'chelsea', side: 'left', pair: 0, position: 1, tone: 'light' },
  { id: 'galatasaray', side: 'left', pair: 1, position: 0, tone: 'light' },
  { id: 'liverpool', side: 'left', pair: 1, position: 1, tone: 'light' },
  { id: 'realMadrid', side: 'left', pair: 2, position: 0, tone: 'light' },
  { id: 'manCity', side: 'left', pair: 2, position: 1, tone: 'light' },
  { id: 'atalanta', side: 'left', pair: 3, position: 0, tone: 'light' },
  { id: 'bayern', side: 'left', pair: 3, position: 1, tone: 'light' },
  // Lado derecho
  { id: 'newcastle', side: 'right', pair: 0, position: 0, tone: 'cyan' },
  { id: 'barcelona', side: 'right', pair: 0, position: 1, tone: 'cyan' },
  { id: 'atleti', side: 'right', pair: 1, position: 0, tone: 'cyan' },
  { id: 'tottenham', side: 'right', pair: 1, position: 1, tone: 'cyan' },
  { id: 'bodo', side: 'right', pair: 2, position: 0, tone: 'cyan' },
  { id: 'sporting', side: 'right', pair: 2, position: 1, tone: 'cyan' },
  { id: 'leverkusen', side: 'right', pair: 3, position: 0, tone: 'cyan' },
  { id: 'arsenal', side: 'right', pair: 3, position: 1, tone: 'cyan' },
];

const calculateLayout = (width, height) => {
  const CARD_HEIGHT = 50;
  const CARD_GAP = 8;
  const MARGIN_Y = height * 0.06;
  const centerX = width / 2;
  const centerY = height / 2;
  const availableHeight = height - MARGIN_Y * 2 - 80;
  const pairSpacing = availableHeight / 3;

  // Centro vertical del enfrentamiento entre dos tarjetas del mismo pair (alinea slot con badge y conectores).
  const pairMatchupCenterY = (pairIndex) =>
    MARGIN_Y + pairIndex * pairSpacing + CARD_HEIGHT + CARD_GAP / 2;

  const sfBandCenterY =
    MARGIN_Y + 1.5 * pairSpacing + CARD_HEIGHT + CARD_GAP / 2;

  const slotCenterY = (slot) => {
    if (slot.round === 'r16') {
      return pairMatchupCenterY(slot.row);
    }
    if (slot.round === 'qf') {
      const lo = Math.floor(slot.row);
      return (pairMatchupCenterY(lo) + pairMatchupCenterY(lo + 1)) / 2;
    }
    return sfBandCenterY;
  };

  // Dividir el ancho en 8 zonas iguales para garantizar simetria perfecta:
  // zona0=card_L | zona1=R16_L | zona2=QF_L | zona3=SF_L | zona4=SF_R | zona5=QF_R | zona6=R16_R | zona7=card_R
  const zone = width / 8;
  const CARD_WIDTH = Math.min(zone * 0.9, 200);
  const SLOT_SIZE = Math.min(zone * 0.75, 90);

  // Centro de cada zona -> posicion X del elemento
  const CARD_X_L  = zone * 0    + (zone - CARD_WIDTH) / 2;   // zona 0
  const L_R16     = zone * 1    + (zone - SLOT_SIZE)  / 2;   // zona 1
  const L_QF      = zone * 2    + (zone - SLOT_SIZE)  / 2;   // zona 2
  const L_SF      = zone * 3    + (zone - SLOT_SIZE)  / 2;   // zona 3
  const FINAL     = centerX     - SLOT_SIZE / 2;              // centro exacto
  const R_SF      = zone * 4    + (zone - SLOT_SIZE)  / 2;   // zona 4 (espejo zona 3)
  const R_QF      = zone * 5    + (zone - SLOT_SIZE)  / 2;   // zona 5 (espejo zona 2)
  const R_R16     = zone * 6    + (zone - SLOT_SIZE)  / 2;   // zona 6 (espejo zona 1)
  const CARD_X_R  = zone * 7    + (zone - CARD_WIDTH) / 2;   // zona 7 (espejo zona 0)

  const slotColumns = { 0: L_R16, 1: L_QF, 2: L_SF, 3: FINAL, 4: R_SF, 5: R_QF, 6: R_R16 };

  const trophyDrawW = Math.min(140, SLOT_SIZE * 1.65);
  const trophyDrawH = trophyDrawW * 1.4;
  const gapBelowTrophy = 40;
  const campeonPillH = 30;
  const gapPillToChampionSlot = 22;
  const campeonLabelCy = centerY + trophyDrawH / 2 + gapBelowTrophy + campeonPillH / 2;
  const championSlotY =
    centerY + trophyDrawH / 2 + gapBelowTrophy + campeonPillH + gapPillToChampionSlot;

  const teamCards = initialTeamCards.map(card => ({
    ...card,
    x: card.side === 'left' ? CARD_X_L : CARD_X_R,
    y: MARGIN_Y + card.pair * pairSpacing + card.position * (CARD_HEIGHT + CARD_GAP),
  }));

  const slotPositions = slots.map((slot) => {
    if (slot.id === 'champion') {
      return { ...slot, x: FINAL, y: championSlotY };
    }
    return {
      ...slot,
      x: slotColumns[slot.col],
      y: slotCenterY(slot) - SLOT_SIZE / 2,
    };
  });

  const calculatedConnectors = [];
  const BADGE_HALF_W = 28;
  const eps = 0.5;

  const pathFromPoints = (points) => {
    if (!points.length) return '';
    const [x0, y0] = points[0];
    return `M ${x0} ${y0}` + points.slice(1).map(([x, y]) => ` L ${x} ${y}`).join('');
  };

  const mirrorX = (x) => 2 * centerX - x;

  // Forward: siempre vx < destX (hacia el centro). Etiqueta en el punto medio entre unión y borde del slot
  // para que el tramo sólido llegue hasta el badge y el discontinuo salga hacia el siguiente nodo sin “dar la vuelta”.
  const pushOutgoingForward = (strokeSide, vx, my, destX, destY, badgeCxFwd, toReal) => {
    const pushLine = (dashed, fwdPts) => {
      const pts = fwdPts.map(([x, y]) => [toReal(x), y]);
      calculatedConnectors.push({ side: strokeSide, dashed, path: pathFromPoints(pts) });
    };

    if (Math.abs(destX - vx) < eps) {
      if (Math.abs(destY - my) > eps) pushLine(true, [[vx, my], [destX, destY]]);
      return;
    }

    const bl = badgeCxFwd - BADGE_HALF_W;
    const br = badgeCxFwd + BADGE_HALF_W;

    if (vx + eps < bl) {
      const solidEnd = Math.min(bl, destX);
      if (solidEnd > vx + eps) pushLine(false, [[vx, my], [solidEnd, my]]);
    }

    const dashStart = Math.max(br, vx);
    if (dashStart + eps < destX) {
      if (Math.abs(destY - my) > eps) {
        pushLine(true, [[dashStart, my], [destX, my], [destX, destY]]);
      } else {
        pushLine(true, [[dashStart, my], [destX, my]]);
      }
    } else if (Math.abs(destY - my) > eps) {
      pushLine(true, [[destX, my], [destX, destY]]);
    }
  };

  const bracket = (strokeSide, attachX, y1, y2, vertX, midY, destX, destY, badgeCxReal) => {
    const toFwd = strokeSide === 'right' ? mirrorX : (x) => x;
    const toReal = strokeSide === 'right' ? mirrorX : (x) => x;

    const ax = toFwd(attachX);
    const vx = toFwd(vertX);
    const dx = toFwd(destX);
    const bx = toFwd(badgeCxReal);

    const mapPt = ([x, y]) => [toReal(x), y];
    const pushLeg = (y) => {
      const fwd = [
        [ax, y],
        [vx, y],
        [vx, midY],
      ];
      calculatedConnectors.push({
        side: strokeSide,
        dashed: false,
        path: pathFromPoints(fwd.map(mapPt)),
      });
    };

    pushLeg(y1);
    pushLeg(y2);
    pushOutgoingForward(strokeSide, vx, midY, dx, destY, bx, toReal);
  };

  // Tarjetas -> R16 (r16 derecha índices 10–13)
  for (let pairIdx = 0; pairIdx < 8; pairIdx++) {
    const c1 = teamCards[pairIdx * 2];
    const c2 = teamCards[pairIdx * 2 + 1];
    if (!c1 || !c2) continue;
    const slotIdx = pairIdx < 4 ? pairIdx : pairIdx + 6;
    const slot = slotPositions[slotIdx];
    if (!slot) continue;
    const midY = (c1.y + c2.y) / 2 + CARD_HEIGHT / 2;
    const yTop = c1.y + CARD_HEIGHT / 2;
    const yBot = c2.y + CARD_HEIGHT / 2;
    const destY = slot.y + SLOT_SIZE / 2;
    if (c1.side === 'left') {
      const attachX = c1.x + CARD_WIDTH;
      const vertX = (attachX + slot.x) / 2;
      const badgeCx = (vertX + slot.x) / 2;
      bracket('left', attachX, yTop, yBot, vertX, midY, slot.x, destY, badgeCx);
    } else {
      const attachX = c1.x;
      const vertX = (attachX + slot.x + SLOT_SIZE) / 2;
      const destEdge = slot.x + SLOT_SIZE;
      const badgeCx = (vertX + destEdge) / 2;
      bracket('right', attachX, yTop, yBot, vertX, midY, destEdge, destY, badgeCx);
    }
  }

  // Slots -> siguiente ronda
  slotPositions.forEach((slot) => {
    if (!slot.sources) return;
    if (slot.round === 'champion') return;
    const src1 = slotPositions.find(s => s.id === slot.sources[0]);
    const src2 = slotPositions.find(s => s.id === slot.sources[1]);
    if (!src1 || !src2) return;
    let midY = (src1.y + src2.y) / 2 + SLOT_SIZE / 2;
    let destY = slot.y + SLOT_SIZE / 2;
    if (slot.round === 'sf') {
      midY = sfBandCenterY;
      destY = sfBandCenterY;
    }
    const ySrc1 = src1.y + SLOT_SIZE / 2;
    const ySrc2 = src2.y + SLOT_SIZE / 2;
    if (slot.side === 'left') {
      const vertX = src1.x + SLOT_SIZE;
      const destEdge = slot.x;
      const badgeCx = (vertX + destEdge) / 2;
      bracket('left', vertX, ySrc1, ySrc2, vertX, midY, destEdge, destY, badgeCx);
    } else if (slot.side === 'right') {
      const vertX = src1.x;
      const destEdge = slot.x + SLOT_SIZE;
      const badgeCx = (vertX + destEdge) / 2;
      bracket('right', vertX, ySrc1, ySrc2, vertX, midY, destEdge, destY, badgeCx);
    }
  });

  const roundBadges = [];
  slotPositions.forEach((slot) => {
    if (slot.round === 'champion' || !slot.label) return;
    let badgeX;
    let badgeY;
    if (!slot.sources) {
      const side = slot.side;
      const card1 = teamCards.find(
        (c) => c.side === side && c.pair === slot.row && c.position === 0
      );
      const card2 = teamCards.find(
        (c) => c.side === side && c.pair === slot.row && c.position === 1
      );
      if (!card1 || !card2) return;
      badgeY = (card1.y + card2.y) / 2 + CARD_HEIGHT / 2;
      const attach = side === 'left' ? card1.x + CARD_WIDTH : card1.x;
      const vertX =
        side === 'left'
          ? (attach + slot.x) / 2
          : (attach + slot.x + SLOT_SIZE) / 2;
      badgeX =
        side === 'left'
          ? (vertX + slot.x) / 2
          : (vertX + slot.x + SLOT_SIZE) / 2;
    } else {
      const src1 = slotPositions.find((s) => s.id === slot.sources[0]);
      const src2 = slotPositions.find((s) => s.id === slot.sources[1]);
      if (!src1 || !src2) return;
      badgeY = (src1.y + src2.y) / 2 + SLOT_SIZE / 2;
      if (slot.side === 'left') {
        const mergeX = src1.x + SLOT_SIZE;
        badgeX = (mergeX + slot.x) / 2;
      } else if (slot.side === 'right') {
        const mergeX = src1.x;
        badgeX = (mergeX + slot.x + SLOT_SIZE) / 2;
      } else {
        badgeX = slot.x + SLOT_SIZE / 2;
      }
    }
    roundBadges.push({
      slotId: slot.id,
      x: badgeX,
      y: badgeY,
      label: slot.label,
      side: slot.side,
    });
  });

  return {
    teamCards,
    slots: slotPositions,
    connectors: calculatedConnectors,
    roundBadges,
    slotSize: SLOT_SIZE,
    cardWidth: CARD_WIDTH,
    cardHeight: CARD_HEIGHT,
    centerX,
    centerY,
    sfBandCenterY,
    boardWidth: width,
    boardHeight: height,
    trophyDrawW,
    trophyDrawH,
    campeonLabelCy,
  };
};



const getDescendants = (slotId) => {
  const direct = Object.entries(sourceMap)
    .filter(([, sources]) => sources.includes(slotId))
    .map(([id]) => id);

  return direct.flatMap((id) => [id, ...getDescendants(id)]);
};

const loadCanvasImage = (src, useCors = false) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    if (useCors) {
      image.crossOrigin = 'anonymous';
    }
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });

const drawCoverImage = (context, image, width, height) => {
  const scale = Math.max(width / image.width, height / image.height);
  const x = (width - image.width * scale) / 2;
  const y = (height - image.height * scale) / 2;
  context.drawImage(image, x, y, image.width * scale, image.height * scale);
};

const drawTeamCard = (context, card, logos, cardWidth = 180) => {
  const team = teams[card.id];
  const nameMaxW = Math.max(80, cardWidth - 66);

  context.fillStyle = card.tone === 'cyan' ? '#00d4f8' : '#dce4e8';
  context.beginPath();
  context.roundRect(card.x, card.y, cardWidth, 50, 4);
  context.fill();

  const logo = logos?.[card.id];
  if (logo) {
    context.drawImage(logo, card.x + 10, card.y + 7, 36, 36);
  }

  context.fillStyle = card.tone === 'cyan' ? '#000000' : '#1a1a1a';
  context.font = '900 13px Arial';
  context.textAlign = 'left';
  context.textBaseline = 'middle';
  context.fillText(team.name, card.x + 54, card.y + 25, nameMaxW);
};

const drawSlot = (context, slot, picks, logos, slotSize = 110) => {
  const selectedTeam = picks[slot.id] ? teams[picks[slot.id]] : null;
  const width = slotSize;
  const height = slotSize;

  const isChampion = slot.round === 'champion';
  const bgColor = isChampion ? '#f2e6b8' : slot.side === 'right' ? '#00d4f8' : '#d4dce3';
  context.fillStyle = bgColor;
  context.beginPath();
  context.roundRect(slot.x, slot.y, width, height, 16);
  context.fill();

  context.strokeStyle = isChampion ? '#b8860b' : slot.side === 'right' ? '#0099cc' : '#4a2c6b';
  context.lineWidth = isChampion ? 5 : 4;
  context.stroke();
  
  // Sombra
  context.shadowColor = 'rgba(0, 0, 0, 0.5)';
  context.shadowBlur = 20;
  context.shadowOffsetX = 0;
  context.shadowOffsetY = 6;
  context.stroke();
  context.shadowColor = 'transparent';
  context.shadowBlur = 0;

  if (selectedTeam) {
    const logo = logos?.[selectedTeam.id];
    if (logo) {
      const logoSize = width * 0.55; // Ajustado proporcionalmente
      context.drawImage(logo, slot.x + (width - logoSize)/2, slot.y + (height - logoSize)/2, logoSize, logoSize);
    }
  } else {
    context.fillStyle = 'rgba(26, 26, 26, 0.3)';
    context.font = '900 11px Arial'; // Texto más pequeño
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.font = '900 11px Arial';
    context.fillText('ARRASTRA AQUI', slot.x + width / 2, slot.y + height / 2);
  }
};

const drawRoundBadgeCanvas = (context, badge) => {
  const padX = 14;
  const h = 26;
  context.save();
  context.font = '900 13px Arial';
  const tw = context.measureText(badge.label).width;
  const w = Math.max(48, tw + padX * 2);
  const x = badge.x - w / 2;
  const y = badge.y - h / 2;
  const isCyan = badge.side === 'right' || badge.side === 'center';
  context.fillStyle = isCyan ? '#00d4f8' : '#2d1b4e';
  context.shadowColor = 'rgba(0, 0, 0, 0.4)';
  context.shadowBlur = 6;
  context.shadowOffsetY = 2;
  context.beginPath();
  context.roundRect(x, y, w, h, h / 2);
  context.fill();
  context.shadowColor = 'transparent';
  context.shadowBlur = 0;
  context.fillStyle = isCyan ? '#001041' : '#ffffff';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillText(badge.label, badge.x, badge.y);
  context.restore();
};

const exportCanvasPng = async (picks, layout) => {
  if (!layout) return;

  const canvas = document.createElement('canvas');
  const w = layout.boardWidth || 1600;
  const h = layout.boardHeight || 900;
  canvas.width = w;
  canvas.height = h;
  const context = canvas.getContext('2d');

  const [background, trophy, ...logoResults] = await Promise.all([
    loadCanvasImage(backgroundImage),
    loadCanvasImage(trophyImage),
    ...Object.values(teams).map((team) =>
      loadCanvasImage(team.logo, true).catch(() => null)
    ),
  ]);

  const logos = Object.fromEntries(
    Object.keys(teams).map((key, index) => [key, logoResults[index]])
  );

  const canvasLayout = layout;

  drawCoverImage(context, background, canvas.width, canvas.height);
  context.fillStyle = 'rgba(2, 6, 41, 0.78)';
  context.fillRect(0, 0, canvas.width, canvas.height);
  const glow = context.createRadialGradient(canvas.width/2, canvas.height/2, 20, canvas.width/2, canvas.height/2, 530);
  glow.addColorStop(0, 'rgba(3, 62, 185, 0.55)');
  glow.addColorStop(1, 'rgba(3, 62, 185, 0)');
  context.fillStyle = glow;
  context.fillRect(0, 0, canvas.width, canvas.height);

  const titleY = Math.max(48, canvas.height * 0.085);
  const cx = canvasLayout.centerX;
  const roadSize = Math.max(22, canvas.height * 0.038);
  const budSize = Math.max(36, canvas.height * 0.058);
  const titleGap = Math.max(12, canvas.height * 0.014);
  context.textBaseline = 'alphabetic';
  context.fillStyle = '#ffffff';
  context.font = `500 ${roadSize}px Arial`;
  const roadW = context.measureText('ROAD TO').width;
  context.font = `900 ${budSize}px "Brush Script MT", "Segoe Script", cursive`;
  const budW = context.measureText('BUDAPEST 26').width;
  const titleTotal = roadW + titleGap + budW;
  let titleX = cx - titleTotal / 2;
  context.font = `500 ${roadSize}px Arial`;
  context.textAlign = 'left';
  context.fillText('ROAD TO', titleX, titleY);
  titleX += roadW + titleGap;
  context.font = `900 ${budSize}px "Brush Script MT", "Segoe Script", cursive`;
  context.fillText('BUDAPEST 26', titleX, titleY);

  // Dibujar conectores
  canvasLayout.connectors.forEach((conn) => {
    context.strokeStyle = conn.side === 'right' ? '#00d4f8' : '#c8d4d8';
    context.lineWidth = 3;
    if (conn.dashed) {
      context.setLineDash([6, 8]);
    }
    context.stroke(new Path2D(conn.path));
    context.setLineDash([]);
  });

  canvasLayout.teamCards.forEach((card) =>
    drawTeamCard(context, card, logos, canvasLayout.cardWidth)
  );

  canvasLayout.slots
    .filter((s) => s.id !== 'champion')
    .forEach((slot) => drawSlot(context, slot, picks, logos, canvasLayout.slotSize));

  const tw = canvasLayout.trophyDrawW;
  const th = canvasLayout.trophyDrawH;
  context.drawImage(
    trophy,
    canvasLayout.centerX - tw / 2,
    canvasLayout.centerY - th / 2,
    tw,
    th
  );

  context.save();
  const pillH = 32;
  context.textAlign = 'left';
  context.textBaseline = 'middle';
  context.font =
    '900 15px Arial, "Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif';
  const labelW = context.measureText(CAMPEON_PILL_TEXT).width;
  const pillW = Math.max(240, labelW + 40);
  const px = canvasLayout.centerX - pillW / 2;
  const py = canvasLayout.campeonLabelCy - pillH / 2;
  const grad = context.createLinearGradient(px, py, px + pillW, py + pillH);
  grad.addColorStop(0, '#d4af37');
  grad.addColorStop(0.5, '#f9e4a8');
  grad.addColorStop(1, '#d4af37');
  context.fillStyle = grad;
  context.beginPath();
  context.roundRect(px, py, pillW, pillH, pillH / 2);
  context.fill();
  context.strokeStyle = '#8b6914';
  context.lineWidth = 2;
  context.stroke();
  context.fillStyle = '#1a1204';
  context.textAlign = 'center';
  context.fillText(CAMPEON_PILL_TEXT, canvasLayout.centerX, canvasLayout.campeonLabelCy);
  context.restore();

  const champ = canvasLayout.slots.find((s) => s.id === 'champion');
  if (champ) drawSlot(context, champ, picks, logos, canvasLayout.slotSize);

  (canvasLayout.roundBadges || []).forEach((b) => drawRoundBadgeCanvas(context, b));

  // Dibujar leyenda
  context.strokeStyle = '#e7f2f5';
  context.setLineDash([1, 10]);
  context.lineCap = 'round';
  context.lineWidth = 4;
  context.beginPath();
  context.moveTo(canvas.width/2 - 40, canvas.height - 60);
  context.lineTo(canvas.width/2 + 40, canvas.height - 60);
  context.stroke();
  context.strokeStyle = '#00d4f8';
  context.beginPath();
  context.moveTo(canvas.width/2 - 40, canvas.height - 48);
  context.lineTo(canvas.width/2 + 40, canvas.height - 48);
  context.stroke();
  context.setLineDash([]);
  context.fillStyle = '#ffffff';
  context.font = '900 16px Arial';
  context.fillText('TEAMS PLAY 2ND LEG AT HOME', canvas.width/2, canvas.height - 25);

  const link = document.createElement('a');
  link.download = 'mi-bracket-champions-league.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
};

const getAllowedTeams = (slotId, picks) => {
  if (initialMatches[slotId]) {
    return initialMatches[slotId];
  }

  if (slotId === 'champion') {
    const fromSf = sourceMap.champion.map((source) => picks[source]).filter(Boolean);
    return [...new Set(fromSf)];
  }

  return sourceMap[slotId].map((source) => picks[source]).filter(Boolean);
};

const Bracket = forwardRef(function Bracket({ onExporterReady }, ref) {
  const stageRef = useRef(null);
  const [picks, setPicks] = useState({});
  const [dragging, setDragging] = useState(null);
  const [layout, setLayout] = useState(null);

  const allowedBySlot = useMemo(
    () => Object.fromEntries(slots.map((slot) => [slot.id, getAllowedTeams(slot.id, picks)])),
    [picks]
  );

  // Calcular layout cuando cambie el tamaño
  useEffect(() => {
    const updateLayout = () => {
      if (!stageRef.current) return;
      const { clientWidth, clientHeight } = stageRef.current;
      const newLayout = calculateLayout(clientWidth, clientHeight - 100); // Restar espacio para header/footer
      setLayout(newLayout);
    };

    updateLayout();
    const observer = new ResizeObserver(updateLayout);
    if (stageRef.current) {
      observer.observe(stageRef.current);
    }
    window.addEventListener('resize', updateLayout);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateLayout);
    };
  }, []);

  const canDropTeam = (slotId, teamId) => allowedBySlot[slotId]?.includes(teamId);

  const getDropTarget = (x, y) => {
    const candidates = Array.from(document.querySelectorAll('[data-slot-id]'));

    return candidates.find((element) => {
      const box = element.getBoundingClientRect();
      const padding = 34;
      return (
        x >= box.left - padding &&
        x <= box.right + padding &&
        y >= box.top - padding &&
        y <= box.bottom + padding
      );
    });
  };

  const handleDrop = (slotId, teamId) => {
    setPicks((current) => {
      const next = { ...current, [slotId]: teamId };
      getDescendants(slotId).forEach((id) => {
        delete next[id];
      });

      return next;
    });
  };

  useEffect(() => {
    if (!dragging) {
      return undefined;
    }

    const handlePointerMove = (event) => {
      setDragging((current) => (current ? { ...current, x: event.clientX, y: event.clientY } : current));
    };

    const handlePointerUp = (event) => {
      const slotElement =
        document.elementFromPoint(event.clientX, event.clientY)?.closest('[data-slot-id]') ||
        getDropTarget(event.clientX, event.clientY);
      const slotId = slotElement?.getAttribute('data-slot-id');

      if (slotId && allowedBySlot[slotId]?.includes(dragging.teamId)) {
        handleDrop(slotId, dragging.teamId);
      }

      setDragging(null);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp, { once: true });

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [dragging, allowedBySlot]);

  useEffect(() => {
    onExporterReady?.(() => exportCanvasPng(picks, layout));
  }, [onExporterReady, picks, layout]);

  const handlePointerStart = (event, teamId) => {
    event.preventDefault();
    setDragging({ teamId, x: event.clientX, y: event.clientY });
  };

  if (!layout) {
    return <section className="bracket-export" ref={stageRef}><div>Cargando...</div></section>;
  }

  return (
    <section className="bracket-export" ref={stageRef}>
      <div className="bracket-board-responsive" ref={ref}>
        <div className="bracket-title">
          <span>ROAD TO</span>
          <strong>BUDAPEST 26</strong>
        </div>

        <svg
          className="connectors-svg"
          aria-hidden
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 2 }}
        >
          {layout.connectors.map((conn, idx) => (
            <path
              key={idx}
              d={conn.path}
              stroke={conn.side === 'right' ? '#00d4f8' : '#c8d4d8'}
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={conn.dashed ? '6 8' : 'none'}
            />
          ))}
        </svg>

        {(layout.roundBadges || []).map((b) => (
          <div
            key={`badge-${b.slotId}`}
            className={`round-badge ${b.side}`}
            style={{ left: b.x, top: b.y, transform: 'translate(-50%, -50%)' }}
          >
            {b.label}
          </div>
        ))}

        {/* Tarjetas de equipos */}
        {layout.teamCards.map((card) => (
          <div key={card.id} className="team-position" style={{ left: card.x, top: card.y, width: layout.cardWidth, height: layout.cardHeight }}>
            <Team team={teams[card.id]} tone={card.tone} onPointerStart={handlePointerStart} />
          </div>
        ))}

        {/* Slots (sin campeón: va debajo del trofeo) */}
        {layout.slots
          .filter((slot) => slot.id !== 'champion')
          .map((slot) => (
            <Match
              key={slot.id}
              slot={slot}
              teams={teams}
              team={picks[slot.id]}
              canDropTeam={canDropTeam}
              onDrop={handleDrop}
              size={layout.slotSize}
            />
          ))}

        <div
          className="trophy-wrap-responsive"
          style={{
            left: `${layout.centerX}px`,
            top: `${layout.centerY}px`,
            transform: 'translate(-50%, -50%)',
          }}
        >
          <img className="trophy" src={trophyImage} alt="Trofeo UEFA Champions League" />
        </div>

        <div
          className="campeon-pill"
          style={{
            left: `${layout.centerX}px`,
            top: `${layout.campeonLabelCy}px`,
            transform: 'translate(-50%, -50%)',
          }}
        >
          {CAMPEON_PILL_TEXT}
        </div>

        {layout.slots
          .filter((slot) => slot.id === 'champion')
          .map((slot) => (
            <Match
              key={slot.id}
              slot={slot}
              teams={teams}
              team={picks[slot.id]}
              canDropTeam={canDropTeam}
              onDrop={handleDrop}
              size={layout.slotSize}
            />
          ))}

        <div className="legend">
          <span></span>
          <strong>TEAMS PLAY 2ND LEG AT HOME</strong>
        </div>

        {dragging && (
          <div className="drag-ghost" style={{ left: dragging.x, top: dragging.y }}>
            <img crossOrigin="anonymous" src={teams[dragging.teamId].logo} alt="" />
            <span>{teams[dragging.teamId].name}</span>
          </div>
        )}
        <button className="board-export-button" type="button" onClick={() => exportCanvasPng(picks, layout)}>
          <span className="download-icon" aria-hidden="true"></span>
          Exportar PNG
        </button>
      </div>
    </section>
  );
});

export default Bracket;
