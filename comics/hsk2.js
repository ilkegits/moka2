/* ShiCards: the comics of HSK 2, the snack street by night (小吃街). Loaded the first time the HSK 2 course is opened.
   Each unit has two parts of four panels, drawn with the kit HSK 1's comics use (see COMIC in index.html): part 1 ends
   at the worst moment, part 2 is the happy ending after the boss. Bubbles only use words up to that unit.
   The friend of this level is Bao Bao, the little steamed bun who would rather not be eaten. */
SHI_COMICS(2, K => {
  const { red, gold, gold2, ln, fl, wood, woodD, hz, hzO, star, paw, arm, lion, sweat, friend, lantern, burst, bubble, W, grad, pop, shout, note, seal, onFriend, confetti, snow, stars, ground, speed, q, zz, card, sign, clock, table, steam, bowl, cup, board, door, win, moon, sun, medal, plane, taxi, bedBack, blanket, crowd, awning, tears, page } = K;

  /* the snack street by night: a violet sky, the far roofs with lit windows, the paving */
  const night = (w, h, gy, n = 7) => grad(w, h, '#2E1A56', '#B0478C') + stars(w, gy * .55, n, w + 3)
    + `<path d="M-20 ${gy}V${gy - 44}h46v-18h60v18h42v-30h82v30h38v-16h64v16h80V${gy}Z" fill="#6A2A6A"/>`
    + [[44, gy - 50], [152, gy - 62], [262, gy - 48]].filter(([x]) => x < w - 10).map(([x, y]) => `<rect x="${x}" y="${y}" width="14" height="12" fill="#FFD98A" opacity=".85"/>`).join('')
    + ground(w, h, gy, '#4A2A5E');
  const lamps = (w, y, n) => `<path d="M-10 ${y}Q${w / 2} ${y + 24} ${w + 10} ${y}" fill="none" stroke="#1E0E36" stroke-width="2"/>`
    + Array.from({ length: n }, (_, i) => { const t = (i + .5) / n; return lantern(t * w, y + 25 + 12 * (1 - (2 * t - 1) ** 2), .46, gold); }).join('');
  const stall = (x, y, w, c, txt, hgt = 92) => `<rect x="${x + 4}" y="${y + 18}" width="6" height="${hgt}" fill="${woodD}" stroke="${ln}" stroke-width="2"/><rect x="${x + w - 10}" y="${y + 18}" width="6" height="${hgt}" fill="${woodD}" stroke="${ln}" stroke-width="2"/>`
    + awning(x, y, w, c) + `<rect x="${x - 4}" y="${y + hgt - 14}" width="${w + 8}" height="40" fill="${wood}" stroke="${ln}" stroke-width="3"/>`
    + (txt ? sign(x + w / 2 - txt.length * 9 - 8, y + hgt - 6, txt.length * 18 + 16, 24, txt, 15) : '');
  const basket = (x, y, s = 1, lid = true) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-34 -18V0Q0 12 34 0V-18Z" fill="#E8BC72" stroke="#8A5A1E" stroke-width="3" stroke-linejoin="round"/><path d="M-32 -8Q0 4 32 -8" fill="none" stroke="#8A5A1E" stroke-width="2" opacity=".55"/><ellipse cx="0" cy="-18" rx="34" ry="9" fill="${lid ? '#D9A85E' : '#5A3A1E'}" stroke="#8A5A1E" stroke-width="3"/>${lid ? '<ellipse cx="0" cy="-22" rx="8" ry="3.5" fill="#8A5A1E"/>' : ''}</g>`;
  const lidUp = (x, y, r = -20, s = 1) => `<g transform="translate(${x} ${y}) rotate(${r}) scale(${s})"><ellipse cx="0" cy="0" rx="36" ry="10" fill="#D9A85E" stroke="#8A5A1E" stroke-width="3"/><ellipse cx="0" cy="-4" rx="8" ry="3.5" fill="#8A5A1E"/></g>`;
  /* Bao Bao in his steamer: nervous as he comes; happy, or shouting */
  const bao = (x, y, s, mood, r = 0, flip = false) => friend('bao', x, y, s, r, flip) + (mood ? onFriend(x, y, s, `<rect x="89" y="118" width="22" height="11" fill="#FFF6E6"/>`
    + (mood === 'happy' ? `<path d="M91 119Q100 131 109 119Z" fill="#7E1D19" stroke="#3A2A18" stroke-width="2.5" stroke-linejoin="round"/>` : `<ellipse cx="100" cy="124" rx="6.5" ry="7.5" fill="#7E1D19" stroke="#3A2A18" stroke-width="2"/>`), r, flip) : '');
  /* his grandparents: Grandpa has a moustache and heavy brows, Grandma round glasses and a hair bun */
  const elder = (x, y, s, gran, mood) => bao(x, y, s, mood) + onFriend(x, y, s, gran
    ? `<circle cx="100" cy="74" r="11" fill="#D8D2C8" stroke="#8A8378" stroke-width="3"/><circle cx="80" cy="110" r="12" fill="#fff" fill-opacity=".2" stroke="#5A4630" stroke-width="3"/><circle cx="120" cy="110" r="12" fill="#fff" fill-opacity=".2" stroke="#5A4630" stroke-width="3"/><path d="M92 109H108" stroke="#5A4630" stroke-width="3"/>`
    : `<path d="M70 97Q80 92 90 98M110 98Q120 92 130 97" fill="none" stroke="#B9B2A6" stroke-width="5" stroke-linecap="round"/><path d="M100 117Q90 127 76 121M100 117Q110 127 124 121" fill="none" stroke="#B9B2A6" stroke-width="6" stroke-linecap="round"/>`);
  const tea = (x, y, s = 1, c = '#E8C39A') => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M6 -34L14 -62" stroke="${ln}" stroke-width="7" stroke-linecap="round"/><path d="M6 -34L14 -62" stroke="#FF8AB0" stroke-width="3.5" stroke-linecap="round"/><path d="M-20 -32H20L15 20Q0 26 -15 20Z" fill="${c}" stroke="${ln}" stroke-width="3" stroke-linejoin="round"/><path d="M-19 -22H19" stroke="#fff" stroke-width="3" opacity=".6"/>${[[-8, 12], [2, 15], [9, 9], [-2, 6]].map(([a, b]) => `<circle cx="${a}" cy="${b}" r="3.2" fill="#4A2A1A"/>`).join('')}<ellipse cx="0" cy="-32" rx="21" ry="5" fill="#fff" stroke="${ln}" stroke-width="2.5"/></g>`;
  const fish = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><ellipse cx="0" cy="6" rx="46" ry="11" fill="#fff" stroke="${ln}" stroke-width="2.5"/><path d="M-30 0Q-8 -18 18 -4L34 -14V12L18 2Q-8 14 -30 0Z" fill="#F7A03C" stroke="${ln}" stroke-width="2.5" stroke-linejoin="round"/><circle cx="-20" cy="-2" r="2.4" fill="${ln}"/><path d="M-8 -8Q-2 0 -8 6M2 -8Q8 0 2 5" fill="none" stroke="#C9701E" stroke-width="2"/><path d="M-6 -16q4 -6 0 -12M8 -14q4 -6 0 -12" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" opacity=".8"/></g>`;
  const ball = (x, y, r) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff" stroke="${ln}" stroke-width="${Math.max(2, r / 7)}"/><path d="M${x} ${y - r * .42}L${x + r * .4} ${y - r * .13}L${x + r * .25} ${y + r * .34}H${x - r * .25}L${x - r * .4} ${y - r * .13}Z" fill="#2B2B33"/><path d="M${x} ${y - r * .42}V${y - r}M${x + r * .4} ${y - r * .13}L${x + r * .95} ${y - r * .3}M${x + r * .25} ${y + r * .34}L${x + r * .6} ${y + r * .8}M${x - r * .25} ${y + r * .34}L${x - r * .6} ${y + r * .8}M${x - r * .4} ${y - r * .13}L${x - r * .95} ${y - r * .3}" stroke="#2B2B33" stroke-width="${Math.max(1.5, r / 10)}"/>`;
  const goal = (x, y, w, h) => `<path d="M${x} ${y + h}V${y}H${x + w}V${y + h}" fill="none" stroke="#fff" stroke-width="6" stroke-linejoin="round"/><path d="M${x} ${y + h}V${y}H${x + w}V${y + h}" fill="none" stroke="${ln}" stroke-width="1.5"/><path d="${Array.from({ length: Math.floor(w / 12) }, (_, i) => `M${x + 12 + i * 12} ${y}V${y + h}`).join('')}${Array.from({ length: Math.floor(h / 12) }, (_, i) => `M${x} ${y + 12 + i * 12}H${x + w}`).join('')}" stroke="#fff" stroke-width="1.2" opacity=".7"/>`;
  const pitch = (w, h, gy) => grad(w, h, '#8FD3F0', '#D6F1FF') + `<rect x="-20" y="${gy}" width="${w + 40}" height="${h - gy + 40}" fill="#63B254"/><path d="M-20 ${gy}H${w + 20}" stroke="${ln}" stroke-width="3"/><path d="M-20 ${gy + (h - gy) * .55}H${w + 20}" stroke="#fff" stroke-width="3" opacity=".6"/>`;
  const bus = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-60" y="-56" width="120" height="56" rx="9" fill="#3E7FB1" stroke="${ln}" stroke-width="3"/>${[-50, -24, 2, 28].map(d => `<rect x="${d}" y="-46" width="20" height="18" rx="3" fill="#BDE9FF" stroke="${ln}" stroke-width="2"/>`).join('')}<path d="M-60 -18H60" stroke="#fff" stroke-width="4" opacity=".8"/>${[-34, 36].map(d => `<circle cx="${d}" cy="0" r="10" fill="#2B2B33" stroke="${ln}" stroke-width="2.5"/><circle cx="${d}" cy="0" r="4" fill="#bbb"/>`).join('')}</g>`;
  const smoke = (x, y) => [[0, 0, 9], [-14, -6, 7], [-26, -2, 5]].map(([a, b, r]) => `<circle cx="${x + a}" cy="${y + b}" r="${r}" fill="#fff" opacity=".8"/>`).join('');
  const tower = (x, y, w, h, c = '#7A3A7A') => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${c}" stroke="${ln}" stroke-width="3"/>` + Array.from({ length: Math.floor((h - 16) / 26) }, (_, r) => [0, 1, 2].map(k => `<rect x="${x + 10 + k * (w - 20) / 3}" y="${y + 14 + r * 26}" width="${(w - 20) / 3 - 8}" height="14" fill="${(r + k) % 3 ? '#FFD98A' : '#4A2A5E'}" stroke="${ln}" stroke-width="1.5"/>`).join('')).join('') + `<rect x="${x - 6}" y="${y - 6}" width="${w + 12}" height="8" fill="#5A2A5E" stroke="${ln}" stroke-width="2.5"/>`;
  const bag = (x, y, s = 1, open) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-22 -40Q0 -66 22 -40" fill="none" stroke="${ln}" stroke-width="8" stroke-linecap="round"/><path d="M-22 -40Q0 -66 22 -40" fill="none" stroke="#3E7FB1" stroke-width="4" stroke-linecap="round"/><rect x="-36" y="-42" width="72" height="62" rx="12" fill="#3E7FB1" stroke="${ln}" stroke-width="3"/>${open ? `<path d="M-30 -36H30L22 -16H-22Z" fill="#1E2A44" stroke="${ln}" stroke-width="2.5" stroke-linejoin="round"/>` : `<path d="M-36 -22H36" stroke="${ln}" stroke-width="2.5"/>`}<rect x="-16" y="-4" width="32" height="18" rx="4" fill="#8FD3F0" stroke="${ln}" stroke-width="2.5"/></g>`;
  const pen = (x, y, s = 1, r = -30) => `<g transform="translate(${x} ${y}) rotate(${r}) scale(${s})"><rect x="-30" y="-5" width="48" height="10" rx="2" fill="${gold2}" stroke="${ln}" stroke-width="2.5"/><path d="M18 -5L32 0L18 5Z" fill="#FFF3D6" stroke="${ln}" stroke-width="2.5" stroke-linejoin="round"/><rect x="-36" y="-5" width="8" height="10" rx="2" fill="#FF8AB0" stroke="${ln}" stroke-width="2.5"/></g>`;
  const bottle = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-8" y="-34" width="16" height="10" rx="2" fill="#fff" stroke="${ln}" stroke-width="2.5"/><rect x="-14" y="-26" width="28" height="38" rx="6" fill="#8FE0C4" stroke="${ln}" stroke-width="3"/><rect x="-10" y="-14" width="20" height="16" fill="#fff" stroke="${ln}" stroke-width="2"/><path d="M-2 -10h4v4h4v4h-4v4h-4v-4h-4v-4h4Z" fill="${red}"/></g>`;
  const paper = (x, y, w, h, r = 0, inner = '') => `<g transform="rotate(${r} ${x + w / 2} ${y + h / 2})"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="3" fill="#FFF8EE" stroke="${ln}" stroke-width="3"/><path d="${Array.from({ length: Math.floor((h - 24) / 14) }, (_, i) => `M${x + 10} ${y + 22 + i * 14}H${x + w - 10}`).join('')}" stroke="#D8CDB8" stroke-width="2.5" stroke-linecap="round"/>${inner}</g>`;
  const apron = (x, y, s) => `<path d="M${x - 30 * s} ${y + 60 * s}Q${x} ${y + 76 * s} ${x + 30 * s} ${y + 60 * s}L${x + 26 * s} ${y + 100 * s}H${x - 26 * s}Z" fill="#fff" stroke="${ln}" stroke-width="${3 * s + 1}" stroke-linejoin="round"/><rect x="${x - 8 * s}" y="${y + 76 * s}" width="${16 * s}" height="${12 * s}" fill="#FF8AB0" stroke="${ln}" stroke-width="1.5"/>`;
  const hat = (x, y, s) => `<path d="M${x - 26 * s} ${y - 70 * s}Q${x - 36 * s} ${y - 104 * s} ${x - 8 * s} ${y - 100 * s}Q${x} ${y - 116 * s} ${x + 10 * s} ${y - 100 * s}Q${x + 36 * s} ${y - 104 * s} ${x + 26 * s} ${y - 70 * s}Z" fill="#fff" stroke="${ln}" stroke-width="${3 * s + 1}" stroke-linejoin="round"/>`;
  const spot = (w, h, cx, cy, r) => `<rect x="-20" y="-20" width="${w + 40}" height="${h + 40}" fill="#1E0E36"/><path d="M${cx - 30} -20L${cx - r} ${cy}A${r} ${r * .32} 0 0 0 ${cx + r} ${cy}L${cx + 30} -20Z" fill="#FFF1B8" opacity=".3"/><ellipse cx="${cx}" cy="${cy}" rx="${r}" ry="${r * .32}" fill="#FFF1B8" opacity=".45"/>`;

  /* ---- Unit 1, eating out: the tastiest bun on the snack street has something to say ---- */
  const u1 = [page('h2u1a', 'A', [
    [[['几位？', 'jǐ wèi?', 'how many people?'], ['一位！', 'yí wèi!', 'just one!']], (w, h) => night(w, h, 150) + stall(196, 40, 150, red, '') + sign(236, 12, 70, 25, '饭馆', 16) + friend('dragon', 276, 104, .4)
      + lion(84, 116, .46, 'love', -4) + sweat(106, 146, .7) + bubble(196, 92, 60, 25, 240, 100, '几位?', 15, '#1F5A41') + bubble(130, 40, 62, 26, 106, 72, '一位!', 16) + note(8, 8, 0, ['The snack street'])],
    [[['一条鱼？肉？', 'yì tiáo yú? ròu?', 'a fish? meat?'], ['等一会儿。', 'děng yíhuìr.', 'one moment.']], (w, h) => pop(w, h, '#5CC8A8', '#8FE0C4', 90, 100) + card(16, 34, 66, 92, ['鱼', '肉'], 28, -5)
      + clock(136, 62, 28, 8, 50) + lion(58, 170, .34, 'happy', -4, false) + bubble(126, 122, 98, 26, 176, 160, '等一会儿', 15, '#1F5A41')],
    [[['这个最好吃！', 'zhège zuì hǎochī!', 'this one is the tastiest!']], (w, h) => pop(w, h, '#FFC44D', '#FFE08A', 90, 130) + table(90, 176, 150, 44) + basket(90, 166, 1.5) + steam(90, 112, 1.2)
      + shout(92, 50, 70, 24, '最好吃!', 18) + star(26, 106, 8, '#fff') + star(156, 96, 7, '#fff')],
    [[['别吃我！', 'bié chī wǒ!', "don't eat me!"]], (w, h) => pop(w, h, '#B23A2C', '#D9443A', 244, 116) + table(244, 178, 200, 46) + bao(244, 110, .62, 'shout') + lidUp(322, 48, -24) + sweat(300, 74, 1.2) + sweat(186, 80, 1)
      + lion(84, 122, .54, 'wow', -6) + shout(160, 44, 76, 27, '别吃我!', 21) + hzO(32, 44, '!', 34, -10, gold) + hzO(326, 150, '啊', 22, 10, gold)],
  ]), page('h2u1b', 'C', [
    [[['别吃我！喝奶茶吧！', 'bié chī wǒ! hē nǎichá ba!', "don't eat me! Have a milk tea!"]], (w, h) => night(w, h, 156) + lamps(w, 0, 4) + stall(214, 46, 130, '#5CC8A8', '奶茶') + tea(250, 122, .6) + tea(300, 122, .6, '#C8E6A0')
      + lion(54, 122, .42, 'oops', -4) + bao(142, 122, .5, 'shout') + bubble(130, 50, 104, 27, 138, 84, '喝奶茶吧!', 16)],
    [[['不错！', 'búcuò!', 'not bad!']], (w, h) => pop(w, h, '#FF9AA6', '#FFC2CB', 120, 100) + lion(112, 102, .56, 'cheer', -4, false) + tea(196, 128, 1.15) + arm(150, 136, 176, 132) + paw(178, 130, 80)
      + shout(288, 58, 58, 25, '不错!', 21) + star(40, 40, 9, '#fff') + star(330, 140, 8, '#fff') + star(250, 24, 6, '#fff')],
    [[['送你！', 'sòng nǐ!', 'for you!'], ['啊，谢谢！', 'a, xièxie!', 'oh, thank you!']], (w, h) => pop(w, h, '#5CC8A8', '#8FE0C4', 92, 150) + arm(0, 60, 54, 86, 12) + paw(60, 88, 100, .8) + tea(92, 108, .8, '#C8E6A0')
      + bao(98, 182, .6, 'happy') + bubble(120, 30, 74, 27, 84, 58, '送你!', 17) + star(154, 120, 7, '#fff')],
    [[['鱼比包子好吃！', 'yú bǐ bāozi hǎochī!', 'fish is tastier than buns!']], (w, h) => night(w, h, 196, 5) + lamps(w, 2, 3) + table(92, 196, 176, 40) + fish(92, 178, 1) + lion(50, 132, .38, 'cheer', -4, false) + bao(140, 138, .42, 'happy')
      + bubble(100, 78, 132, 26, 138, 104, '鱼比包子好吃!', 14) + seal(140, 204)],
  ])];

  /* ---- Unit 2, which way: the steamer is empty, and Bao Bao is somewhere on the street ---- */
  const u2 = [page('h2u2a', 'D', [
    [[['包包不在里面！', 'Bāobao bú zài lǐmiàn!', "Bao Bao isn't inside!"]], (w, h) => W(w, h, '#4A2A5E') + lamps(w, -6, 2) + table(92, 206, 170, 30) + basket(92, 198, 1.5, false) + lidUp(150, 168, 24, .8)
      + lion(84, 118, .46, 'lost', -4) + bubble(92, 34, 124, 26, 92, 58, '不在里面!', 16) + q(160, 96, 26, 12, gold)],
    [[['左边？右边？', 'zuǒbian? yòubian?', 'left? right?']], (w, h) => pop(w, h, '#FFC44D', '#FFE08A', 90, 110) + `<rect x="86" y="26" width="8" height="120" fill="${woodD}" stroke="${ln}" stroke-width="2.5"/>`
      + `<path d="M84 34H30L16 48L30 62H84Z" fill="#FFF3D6" stroke="${ln}" stroke-width="3" stroke-linejoin="round"/>` + hz(54, 49, '左边', 17, 0, red) + `<path d="M96 70H150L164 84L150 98H96Z" fill="#FFF3D6" stroke="${ln}" stroke-width="3" stroke-linejoin="round"/>` + hz(126, 85, '右边', 17, 0, '#2B6CA3')
      + lion(90, 172, .42, 'oops', 0, false) + q(30, 130, 24, -14) + q(150, 140, 24, 14)],
    [[['往前面走！', 'wǎng qiánmiàn zǒu!', 'go straight ahead!'], ['快跑！', 'kuài pǎo!', 'run!']], (w, h) => night(w, h, 132, 5) + friend('rabbit', 58, 92, .42, 0, false, true) + bubble(140, 30, 112, 26, 96, 62, '往前面走!', 15, '#2F7A5A')
      + lion(272, 88, .42, 'focus', 8) + speed([[176, 74, 34], [166, 92, 46], [182, 110, 30]]) + shout(318, 30, 34, 18, '快跑!', 13)],
    [[['包包在楼上面！', 'Bāobao zài lóu shàngmiàn!', 'Bao Bao is on top of the building!'], ['太远了！', 'tài yuǎn le!', 'too far!']], (w, h) => grad(w, h, '#1E0E36', '#7A2E6E') + stars(w, 120, 9, 5) + moon(40, 44, 20)
      + tower(232, 96, 96, 140) + friend('tiger', 262, 62, .3) + bao(312, 70, .24) + sweat(332, 50, .8) + ground(w, h, 194, '#4A2A5E')
      + lion(84, 142, .44, 'wow', -8) + bubble(126, 46, 104, 26, 100, 86, '在楼上面!', 15) + hzO(188, 120, '!', 30, 8, gold)],
  ]), page('h2u2b', 'B', [
    [[['门口在右边！', 'ménkǒu zài yòubian!', 'the entrance is on the right!']], (w, h) => W(w, h, '#7A3A7A') + `<path d="${Array.from({ length: 7 }, (_, i) => `M-20 ${40 + i * 40}H${w + 20}`).join('')}" stroke="#6A2E6A" stroke-width="3"/>`
      + door(104, 150, 62, 116, '#B8332C') + sign(100, 112, 70, 28, '门口', 17) + ground(w, h, 266, '#4A2A5E') + lion(54, 216, .4, 'focus', -4) + arm(74, 214, 96, 196) + paw(98, 192, 60, .5)
      + bubble(56, 152, 86, 26, 54, 184, '在右边!', 16)],
    [[['楼很高，慢慢走…', 'lóu hěn gāo, mànmàn zǒu…', 'the building is tall. Slowly now…']], (w, h) => W(w, h, '#5A2A5E') + `<path d="M-10 268H50V214H100V160H150V106H190" fill="none" stroke="${ln}" stroke-width="9" stroke-linejoin="round"/><path d="M-10 268H50V214H100V160H150V106H190" fill="none" stroke="#B9AE9C" stroke-width="4" stroke-linejoin="round"/>`
      + lion(76, 150, .4, 'tired', -10) + sweat(106, 118, .9) + sweat(40, 124, .7) + bubble(98, 40, 110, 26, 84, 86, '慢慢走…', 16) + hzO(150, 250, '高', 30, 8, gold)],
    [[['我在这儿！上面真好看！', 'wǒ zài zhèr! shàngmiàn zhēn hǎokàn!', "I'm here! It is so pretty up here!"]], (w, h) => grad(w, h, '#1E0E36', '#8A3A7E') + stars(w, 150, 9, 8) + moon(140, 50, 22)
      + `<rect x="-20" y="232" width="${w + 40}" height="90" fill="#5A2A5E" stroke="${ln}" stroke-width="3"/>` + friend('tiger', 58, 178, .5, -4) + bao(134, 196, .44, 'happy')
      + bubble(92, 98, 122, 26, 128, 150, '上面真好看!', 14) + lantern(24, 262, .4, gold) + lantern(160, 270, .4, gold)],
    [[['你在我旁边，真好。', 'nǐ zài wǒ pángbiān, zhēn hǎo.', 'you are beside me. How nice.']], (w, h) => grad(w, h, '#2E1A56', '#B0478C') + stars(w, 130, 8, 11) + lamps(w, 6, 3)
      + `<rect x="-20" y="238" width="${w + 40}" height="90" fill="#5A2A5E" stroke="${ln}" stroke-width="3"/>` + lion(64, 186, .46, 'proud', -4) + bao(138, 206, .42, 'happy')
      + bubble(92, 96, 138, 26, 80, 130, '你在我旁边。', 15) + seal(140, 268)],
  ])];

  /* ---- Unit 3, out and about: two tickets abroad, and everything that takes you to the airport is gone ---- */
  const u3 = [page('h2u3a', 'C', [
    [[['我们出国旅游吧！', 'wǒmen chūguó lǚyóu ba!', "let's travel abroad!"]], (w, h) => pop(w, h, '#8FD3F0', '#BDE9FF', 180, 100) + plane(300, 40, .5, -12) + card(194, 56, 84, 50, [''], 22, 10) + card(214, 76, 84, 50, ['机票'], 22, -4, '#2B6CA3')
      + bao(140, 124, .5, 'happy') + lion(60, 112, .46, 'cheer', -4) + bubble(120, 30, 150, 27, 132, 70, '出国旅游吧!', 16)],
    [[['公交车已经走了！', 'gōngjiāochē yǐjīng zǒu le!', 'the bus has already left!']], (w, h) => grad(w, h, '#FFB070', '#FFE3B0') + ground(w, h, 142, '#B9AE9C') + `<rect x="150" y="38" width="7" height="106" fill="#8A8494" stroke="${ln}" stroke-width="2.5"/>` + sign(122, 26, 64, 26, '车站', 16, '#3E7FB1', '#fff')
      + bus(296, 136, .9) + smoke(226, 128) + speed([[190, 96, 30], [200, 112, 24]]) + lion(64, 100, .42, 'oops', -4) + bao(118, 118, .32) + bubble(96, 26, 46, 24, 78, 54, '啊!', 16)],
    [[['地铁…进不去！', 'dìtiě… jìn bu qù!', "the metro… we can't get in!"]], (w, h) => W(w, h, '#3E4868') + `<path d="M24 232V96Q92 40 160 96V232Z" fill="#1E2438" stroke="${ln}" stroke-width="3"/>` + sign(54, 46, 76, 28, '地铁', 18, '#E5483F', '#fff')
      + crowd(w, 196, '#6A749A', 4) + crowd(w, 226, '#8E98BE', 9) + shout(96, 132, 62, 22, '进不去!', 16)],
    [[['飞机快要走了！', 'fēijī kuàiyào zǒu le!', 'the plane is about to leave!']], (w, h) => pop(w, h, '#B23A2C', '#D9443A', 92, 84) + clock(92, 82, 46, 11, 56) + plane(140, 26, .4, -16)
      + lion(60, 190, .4, 'wow', -6) + bao(138, 198, .36, 'shout') + tears(150, 170, .8) + shout(96, 150, 78, 20, '快要走了!', 14)],
  ]), page('h2u3b', 'A', [
    [[['打车！', 'dǎchē!', "let's take a taxi!"], ['快上来！', 'kuài shànglái!', 'quick, get in!']], (w, h) => grad(w, h, '#FFB070', '#FFE3B0') + ground(w, h, 150, '#B9AE9C') + friend('tiger', 250, 92, .3) + taxi(250, 148, 1.3)
      + speed([[150, 110, 30], [140, 128, 40]]) + lion(64, 108, .42, 'cheer', -6) + bao(118, 126, .3, 'happy') + bubble(300, 30, 84, 26, 268, 64, '快上来!', 16, '#8A4410') + shout(70, 34, 44, 20, '打车!', 15)],
    [[['过来！过来！', 'guòlái! guòlái!', 'over here! Over here!']], (w, h) => W(w, h, '#D6F1FF') + `<rect x="-20" y="150" width="${w + 40}" height="80" fill="#B9C8D8" stroke="${ln}" stroke-width="3"/>` + sign(34, 24, 80, 30, '机场', 19, '#3E7FB1', '#fff')
      + friend('rabbit', 116, 126, .46, 0, false, true) + bubble(64, 84, 70, 26, 96, 104, '过来!', 17, '#2F7A5A') + speed([[20, 150, 24], [14, 166, 34]], ln)],
    [[['我们进来了！', 'wǒmen jìnlái le!', "we're in!"]], (w, h) => W(w, h, '#E8EEF6') + `<rect x="28" y="28" width="124" height="86" rx="40" fill="#8FD3F0" stroke="${ln}" stroke-width="4"/>` + K.xcloud(74, 62, .5) + K.xcloud(120, 90, .4)
      + `<rect x="-20" y="150" width="${w + 40}" height="80" fill="#3E7FB1" stroke="${ln}" stroke-width="3"/>` + lion(62, 156, .4, 'cheer', -4, false) + bao(134, 164, .36, 'happy') + shout(92, 128, 60, 18, '进来了!', 14)],
    [[['旅游开始了！', 'lǚyóu kāishǐ le!', 'the trip has begun!']], (w, h) => grad(w, h, '#2E1A56', '#C4508C') + stars(w, 130, 12, 21) + moon(308, 50, 24) + plane(150, 84, 1.3, -8) + speed([[20, 96, 44], [8, 112, 30]])
      + `<path d="M-20 ${h}V182h50v-16h60v16h44v-26h80v26h40v-14h60v14h70V${h}Z" fill="#6A2A6A"/>` + [[52, 176], [160, 168], [262, 178]].map(([x, y]) => `<rect x="${x}" y="${y}" width="12" height="10" fill="#FFD98A"/>`).join('')
      + note(20, 20, 0, ['Next stop: the world!']) + shout(214, 150, 84, 22, '开始了!', 17) + seal(318, 180)],
  ])];

  /* ---- Unit 4, body and sport: Hu Hu wants a match, and Shi Shi's head meets the ball ---- */
  const u4 = [page('h2u4a', 'B', [
    [[['今天晴天。跟我踢足球吧！', 'jīntiān qíngtiān. gēn wǒ tī zúqiú ba!', "it's sunny today. Play football with me!"]], (w, h) => pitch(w, h, 206) + sun(38, 44, 15) + goal(110, 130, 80, 78)
      + friend('tiger', 88, 196, .56) + ball(150, 262, 15) + bubble(96, 74, 128, 27, 92, 126, '踢足球吧!', 17, '#8A4410')],
    [[['好！我爱运动！', 'hǎo! wǒ ài yùndòng!', 'OK! I love sport!']], (w, h) => pop(w, h, '#5CC898', '#8FE0C4', 88, 170) + arm(60, 190, 30, 140, 11) + arm(116, 190, 146, 140, 11) + paw(26, 134, -20, .8) + paw(150, 134, 20, .8)
      + lion(88, 176, .58, 'fire') + shout(88, 52, 70, 26, '我爱运动!', 15)],
    [[['球来了…', 'qiú lái le…', 'here comes the ball…']], (w, h) => pop(w, h, '#FFC44D', '#FFE08A', 92, 110) + speed([[10, 60, 50], [0, 100, 40], [14, 140, 46]], ln) + ball(104, 104, 54)
      + lion(92, 246, .4, 'wow', 0, false) + hzO(40, 200, '!', 30, -10, red)],
    [[['我的头！疼！', 'wǒ de tóu! téng!', 'my head! It hurts!']], (w, h) => W(w, h, '#3E7A3A') + `<path d="M-20 150H${w + 20}" stroke="#fff" stroke-width="3" opacity=".5"/>` + lion(88, 214, .52, 'tired', 78, false)
      + [0, 1, 2, 3].map(i => star(92 + 50 * Math.cos(i * 1.57 + .5), 130 + 16 * Math.sin(i * 1.57 + .5), 8, gold)).join('') + ball(150, 268, 13) + friend('tiger', 140, 54, .26, 6) + hzO(74, 44, '哈哈', 18, -8, gold)
      + shout(92, 104, 46, 22, '疼!', 22)],
  ]), page('h2u4b', 'D', [
    [[['药来了！', 'yào lái le!', 'the medicine is here!']], (w, h) => W(w, h, '#D6F1FF') + `<rect x="92" y="40" width="110" height="130" fill="#FFF8EE" stroke="${ln}" stroke-width="3"/>` + sign(102, 50, 72, 28, '药店', 18, '#2E9E6B', '#fff') + door(118, 96, 44, 74, '#8FE0C4')
      + ground(w, h, 170, '#B9AE9C') + speed([[10, 150, 26], [4, 168, 34]], ln) + bao(70, 150, .44, 'shout') + bottle(110, 190, .8) + bubble(60, 84, 82, 26, 68, 112, '药来了!', 16)],
    [[['休息一会儿…真舒服。', 'xiūxi yíhuìr… zhēn shūfu.', 'a little rest… so comfy.']], (w, h) => grad(w, h, '#261B5C', '#5A4A9E') + moon(140, 40, 16) + bedBack(92, 150, 150) + lion(58, 128, .36, 'sleep', -14, false) + blanket(92, 150, 150, '#E5483F')
      + `<rect x="34" y="96" width="46" height="9" rx="4" fill="#fff" stroke="${ln}" stroke-width="2" transform="rotate(-14 58 100)"/>` + zz(112, 104, 16) + bubble(62, 52, 86, 25, 58, 96, '真舒服…', 15, '#2B6CA3')],
    [[['球进了！', 'qiú jìn le!', 'goal!']], (w, h) => pitch(w, h, 110) + goal(248, 44, 96, 76) + ball(300, 84, 13) + speed([[150, 80, 60], [170, 96, 50]], '#fff') + friend('tiger', 214, 100, .34, -8, false, true)
      + lion(70, 86, .44, 'fire', -8) + shout(130, 34, 62, 22, '球进了!', 17) + star(330, 30, 8, gold)],
    [[['一起跳舞吧！运动真有意思！', 'yìqǐ tiàowǔ ba! yùndòng zhēn yǒu yìsi!', "let's dance together! Sport is so much fun!"]], (w, h) => pop(w, h, '#FF9AA6', '#FFC2CB', 180, 110)
      + confetti([[30, 30, 20, gold], [90, 20, -30, '#5CC8A8'], [150, 44, 40, '#fff'], [220, 22, -10, '#8FD3F0'], [290, 40, 30, gold], [330, 80, -40, '#5CC8A8'], [16, 100, 10, '#fff']])
      + friend('tiger', 56, 132, .4, -10) + friend('rabbit', 304, 132, .4, 10, false, true) + bao(236, 146, .34, 'happy', 8) + lion(150, 122, .5, 'cheer', 6) + arm(120, 128, 92, 86, 10) + paw(88, 80, -20, .7) + arm(178, 130, 208, 92, 10) + paw(212, 86, 20, .7)
      + shout(180, 34, 86, 22, '一起跳舞!', 16) + seal(318, 168)],
  ])];

  /* ---- Unit 5, school days: an exam on the first day, an empty schoolbag and an empty head ---- */
  const u5 = [page('h2u5a', 'A', [
    [[['开学了。今天考试！', 'kāixué le. jīntiān kǎoshì!', 'school has started. Exam today!']], (w, h) => W(w, h, '#F2E3C4') + board(110, 20, 150, 60, '今天考试', 22) + ground(w, h, 150, '#C9A56A')
      + friend('panda', 56, 106, .42) + onFriend(56, 106, .42, `<circle cx="77" cy="90" r="15" fill="none" stroke="${gold2}" stroke-width="4"/><circle cx="123" cy="90" r="15" fill="none" stroke="${gold2}" stroke-width="4"/><path d="M92 88H108" stroke="${gold2}" stroke-width="4"/>`)
      + table(296, 138, 100, 30) + lion(296, 92, .42, 'wow', 4, false) + hzO(238, 110, '!', 30, -8, red)],
    [[['打开书包…我的笔呢？', 'dǎkāi shūbāo… wǒ de bǐ ne?', 'I open my schoolbag… where is my pen?']], (w, h) => pop(w, h, '#8FD3F0', '#BDE9FF', 92, 120) + bag(92, 136, 1.4, true) + q(40, 60, 28, -14) + q(146, 70, 24, 12) + q(96, 44, 20, 0)
      + paw(50, 150, -30, .7) + paw(136, 150, 30, .7)],
    [[['这个题…我不懂！', 'zhège tí… wǒ bù dǒng!', "this question… I don't understand!"]], (w, h) => W(w, h, '#C9A56A') + paper(30, 30, 120, 150, -4, hz(90, 62, '词', 30, 0, ln) + q(126, 60, 22, 10, gold))
      + lion(52, 198, .34, 'lost', 0, false) + bubble(126, 176, 76, 25, 84, 192, '我不懂!', 15)],
    [[['我忘了！我忘了！', 'wǒ wàng le! wǒ wàng le!', "I forgot! I've forgotten it all!"]], (w, h) => pop(w, h, '#3A2A5A', '#5A4A8A', 110, 120) + clock(286, 96, 56, 11, 55) + paper(160, 130, 80, 64, 8)
      + lion(96, 124, .56, 'tired', -6) + sweat(140, 80, 1.2) + sweat(40, 88, 1) + sweat(150, 112, .8) + shout(170, 44, 70, 26, '我忘了!', 20) + note(232, 176, 0, ['Five minutes left…'])],
  ]), page('h2u5b', 'C', [
    [[['拿着！这是我的笔。', 'názhe! zhè shì wǒ de bǐ.', 'take it! This is my pen.']], (w, h) => W(w, h, '#F2E3C4') + ground(w, h, 152, '#C9A56A') + table(250, 136, 180, 36) + bao(96, 124, .5, 'happy') + pen(170, 96, 1.2, -12)
      + lion(286, 84, .4, 'miss', 4, false) + bubble(110, 38, 72, 26, 100, 78, '拿着!', 17) + star(206, 70, 7, gold)],
    [[['等一会儿…我记得！', 'děng yíhuìr… wǒ jìde!', 'wait a moment… I remember!']], (w, h) => pop(w, h, '#FFC44D', '#FFE08A', 80, 100) + lion(70, 108, .5, 'up', -4)
      + `<circle cx="130" cy="70" r="6" fill="#fff" stroke="${ln}" stroke-width="2"/><circle cx="148" cy="56" r="9" fill="#fff" stroke="${ln}" stroke-width="2"/><rect x="164" y="16" width="184" height="96" rx="40" fill="#fff" stroke="${ln}" stroke-width="3"/>`
      + tea(200, 78, .5) + hz(256, 50, '左右', 20, 0, '#2B6CA3') + ball(310, 70, 14) + hz(256, 84, '机票', 17, 0, red) + shout(260, 146, 66, 22, '我记得!', 17)],
    [[['不错！', 'búcuò!', 'well done!']], (w, h) => pop(w, h, '#5CC8A8', '#8FE0C4', 92, 120) + paper(32, 30, 120, 150, 5, hzO(92, 86, '100', 40, -8, red))
      + friend('panda', 132, 196, .3, 6, false, true) + shout(60, 196, 44, 20, '不错!', 15)],
    [[['因为有你，所以我考得好！', 'yīnwèi yǒu nǐ, suǒyǐ wǒ kǎo de hǎo!', 'because of you, I did well in the exam!']], (w, h) => pop(w, h, '#FF9AA6', '#FFC2CB', 92, 140) + lion(70, 132, .46, 'love', -6) + bao(134, 170, .4, 'happy')
      + arm(96, 150, 120, 150, 10) + bubble(92, 46, 118, 26, 76, 76, '因为有你!', 16) + star(160, 100, 8, '#fff') + star(24, 60, 6, '#fff') + seal(140, 204)],
  ])];

  /* ---- Unit 6, family and New Year: Bao Bao's grandparents come for New Year, and they are very big buns ---- */
  const u6 = [page('h2u6a', 'D', [
    [[['过年了！我爷爷奶奶来了！', 'guònián le! wǒ yéye nǎinai lái le!', "it's New Year! My grandpa and grandma are here!"]], (w, h) => night(w, h, 186, 5) + lamps(w, 0, 3) + snow(w, h, 26, 5)
      + lion(60, 142, .4, 'happy', -4) + bao(130, 150, .44, 'happy') + bubble(92, 70, 96, 26, 126, 106, '过年了!', 17)],
    [[['我介绍：这是爷爷，这是奶奶。', 'wǒ jièshào: zhè shì yéye, zhè shì nǎinai.', 'let me introduce: this is Grandpa, this is Grandma.']], (w, h) => pop(w, h, '#FFC44D', '#FFE08A', 90, 130) + elder(56, 132, .5, false) + elder(126, 136, .5, true)
      + card(22, 30, 60, 30, ['爷爷'], 17, -5) + card(100, 34, 60, 30, ['奶奶'], 17, 5) + star(90, 100, 7, '#fff')],
    [[['这么大的包子…', 'zhème dà de bāozi…', 'such big buns…']], (w, h) => pop(w, h, '#FF9AA6', '#FFC2CB', 96, 86) + lion(96, 90, .52, 'love', -4, false) + sweat(112, 132, .9) + hzO(180, 120, '咕…', 22, -8, '#fff')
      + elder(256, 96, .4, false) + elder(316, 100, .4, true) + sweat(286, 50, 1) + sweat(346, 60, .8) + bubble(200, 30, 132, 26, 140, 60, '这么大的包子…', 14)],
    [[['你是不是想吃我们？！', 'nǐ shì bu shì xiǎng chī wǒmen?!', 'are you thinking of eating us?!']], (w, h) => spot(w, h, 280, 176, 76) + lion(280, 116, .48, 'oops', 4) + sweat(322, 70, 1.1) + sweat(240, 76, .9)
      + elder(52, 138, .44, false, 'shout') + elder(116, 144, .44, true) + bao(170, 156, .3, 'shout') + shout(110, 44, 100, 30, '想吃我们?!', 18) + hzO(336, 40, '?!', 26, 10, gold)],
  ]), page('h2u6b', 'A', [
    [[['不好意思！我来帮忙做饭！', 'bù hǎoyìsi! wǒ lái bāngmáng zuòfàn!', "sorry! I'll help with the cooking!"]], (w, h) => W(w, h, '#F2D9B0') + win(20, 20, 60, 46, '#2E1A56') + ground(w, h, 152, '#C9A56A')
      + apron(104, 98, .48) + lion(104, 98, .48, 'oops', -4) + hat(104, 98, .48) + elder(250, 106, .4, false, 'happy') + elder(312, 110, .4, true, 'happy')
      + bubble(196, 34, 130, 27, 140, 70, '我来帮忙!', 17)],
    [[['这样？', 'zhèyàng?', 'like this?'], ['这样！', 'zhèyàng!', 'like this!']], (w, h) => pop(w, h, '#5CC8A8', '#8FE0C4', 92, 120) + table(92, 170, 170, 30) + bowl(132, 154, .9, true) + elder(52, 118, .36, true, 'happy')
      + paw(120, 96, 30, .7) + `<path d="M100 84Q112 66 124 84Z" fill="#FFF6E6" stroke="${ln}" stroke-width="2.5" stroke-linejoin="round"/>` + bubble(134, 40, 66, 24, 122, 70, '这样?', 15) + bubble(48, 54, 62, 24, 52, 84, '这样!', 15, '#8A5A1E')],
    [[['大家过年好！', 'dàjiā guònián hǎo!', 'happy New Year, everyone!']], (w, h) => pop(w, h, '#B23A2C', '#D9443A', 90, 130) + lantern(26, 50, .5, gold) + lantern(154, 50, .5, gold)
      + `<ellipse cx="90" cy="160" rx="84" ry="30" fill="${wood}" stroke="${ln}" stroke-width="3"/><ellipse cx="90" cy="156" rx="52" ry="17" fill="#C6402F" stroke="${ln}" stroke-width="2.5"/>`
      + fish(90, 148, .9) + bowl(36, 172, .5, true) + bowl(146, 172, .5, true) + steam(90, 118, .8) + shout(90, 72, 74, 22, '过年好!', 17)],
    [[['新年快乐！', 'xīnnián kuàilè!', 'happy New Year!']], (w, h) => grad(w, h, '#1E0E36', '#8A2E5E') + burst(60, 50, 34, gold) + burst(300, 44, 38, '#FFB4A6') + burst(180, 30, 24, '#8FD3F0') + burst(340, 110, 20, gold) + snow(w, 120, 16, 9, 2.4)
      + ground(w, h, 176, '#4A2A5E') + friend('tiger', 30, 150, .28, -6) + friend('rabbit', 326, 148, .3, 6, false, true) + friend('dragon', 276, 150, .28) + friend('panda', 76, 152, .28, 0, false, true)
      + elder(128, 156, .3, false, 'happy') + elder(236, 156, .3, true, 'happy') + bao(180, 182, .2, 'happy') + lion(180, 112, .44, 'star') + medal(180, 152, .36, '二级')
      + shout(180, 40, 96, 24, '新年快乐!', 18) + note(16, 188, 0, ['HSK 2: done!']) + seal(322, 180)],
  ])];

  return {
    201: { title: 'The bun that said no', pages: u1 },
    202: { title: 'Where is Bao Bao?', pages: u2 },
    203: { title: 'Two tickets abroad', pages: u3 },
    204: { title: 'The big match', pages: u4 },
    205: { title: 'The exam', pages: u5 },
    206: { title: 'The New Year dinner', pages: u6 },
  };
});
