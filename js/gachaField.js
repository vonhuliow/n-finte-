1:
2:// Gacha Field - Ultimate Version with Universal Power-Up Collection
3:(function() {
4:    'use strict';
5:    
6:    if (typeof m === 'undefined' || typeof m.fieldUpgrades === 'undefined') {
7:        console.warn("gachaField: waiting for game...");
8:        setTimeout(arguments.callee, 100);
9:        return;
10:    }
11:    
12:    m.fieldUpgrades.push({
13:        name: "ultimate gacha field",
14:        description: "spin the <b style='color:#ffd700'>ULTIMATE GACHA</b> for massive rewards<br>works with ANY field - collect everything!<br>costs <b class='color-f'>10 energy</b> per mega roll",
15:        effect() {
16:            m.fieldMeterColor = "#ffd700";
17:            m.eyeFillColor = m.fieldMeterColor;
18:            m.fillColor = m.fieldMeterColor;
19:            m.fieldRegen = 0.008;
20:            m.energy += m.fieldRegen;
21:            m.setFillColors();
22:            
23:            // Gacha state
24:            m.gachaRolling = false;
25:            m.gachaEndCycle = 0;
26:            m.gachaParticles = [];
27:            m.gachaStars = [];
28:            m.gachaRays = [];
29:            m.gachaExplosions = [];
30:            m.gachaSparkles = [];
31:            m.canCollectAnyPowerUp = true; // Universal collection
32:            
33:            m.hold = () => {
34:                m.fieldFx = 1;
35:                m.setMovement();
36:                
37:                // Epic multi-layered aura
38:                ctx.save();
39:
40:                // Outer rotating rings
41:                for (let ring = 0; ring < 5; ring++) {
42:                    ctx.save();
43:                    ctx.translate(m.pos.x, m.pos.y);
44:                    ctx.rotate((m.cycle * 0.02 + ring) * (ring % 2 === 0 ? 1 : -1));
45:
46:                    const ringRadius = 150 + ring * 30;
47:                    const gradient = ctx.createRadialGradient(0, 0, ringRadius * 0.8, 0, 0, ringRadius);
48:                    gradient.addColorStop(0, 'transparent');
49:                    gradient.addColorStop(0.5, `hsla(${(m.cycle * 5 + ring * 72) % 360}, 100%, 60%, ${0.4 - ring * 0.05})`);
50:                    gradient.addColorStop(1, 'transparent');
51:
52:                    ctx.strokeStyle = gradient;
53:                    ctx.lineWidth = 10;
54:                    ctx.beginPath();
55:                    ctx.arc(0, 0, ringRadius, 0, Math.PI * 2);
56:                    ctx.stroke();
57:
58:                    // Energy sparks on rings
59:                    for (let s = 0; s < 8; s++) {
60:                        const sparkAngle = (Math.PI * 2 / 8) * s + m.cycle * 0.05;
61:                        const sx = Math.cos(sparkAngle) * ringRadius;
62:                        const sy = Math.sin(sparkAngle) * ringRadius;
63:
64:                        ctx.fillStyle = `hsla(${(m.cycle * 5 + s * 45) % 360}, 100%, 70%, 0.8)`;
65:                        ctx.beginPath();
66:                        ctx.arc(sx, sy, 5 + Math.sin(m.cycle * 0.1 + s) * 3, 0, Math.PI * 2);
67:                        ctx.fill();
68:                    }
69:
70:                    ctx.restore();
71:                }
72:
73:                // Inner pulsing core
74:                const pulseSize = 80 + Math.sin(m.cycle * 0.1) * 30;
75:                const coreGradient = ctx.createRadialGradient(m.pos.x, m.pos.y, 0, m.pos.x, m.pos.y, pulseSize);
76:                coreGradient.addColorStop(0, `hsla(${(m.cycle * 3) % 360}, 100%, 80%, 0.9)`);
77:                coreGradient.addColorStop(0.5, `hsla(${(m.cycle * 3 + 60) % 360}, 100%, 60%, 0.6)`);
78:                coreGradient.addColorStop(1, 'transparent');
79:                ctx.fillStyle = coreGradient;
80:                ctx.beginPath();
81:                ctx.arc(m.pos.x, m.pos.y, pulseSize, 0, Math.PI * 2);
82:                ctx.fill();
83:
84:                // Energy bolts shooting out
85:                for (let b = 0; b < 12; b++) {
86:                    const boltAngle = (Math.PI * 2 / 12) * b + m.cycle * 0.03;
87:                    const boltLength = 100 + Math.sin(m.cycle * 0.1 + b) * 50;
88:
89:                    ctx.save();
90:                    ctx.translate(m.pos.x, m.pos.y);
91:                    ctx.rotate(boltAngle);
92:
93:                    const boltGradient = ctx.createLinearGradient(0, 0, boltLength, 0);
94:                    boltGradient.addColorStop(0, `hsla(${(b * 30) % 360}, 100%, 70%, 0.8)`);
95:                    boltGradient.addColorStop(1, 'transparent');
96:
97:                    ctx.fillStyle = boltGradient;
98:                    ctx.fillRect(0, -3, boltLength, 6);
99:                    ctx.restore();
100:                }
101:
102:                ctx.restore();
103:                
104:                // Draw gacha particles
105:                for (let i = m.gachaParticles.length - 1; i >= 0; i--) {
106:                    const p = m.gachaParticles[i];
107:                    p.life--;
108:                    p.x += p.vx;
109:                    p.y += p.vy;
110:                    p.rotation += p.rotSpeed;
111:                    p.scale = 1 + Math.sin(p.life * 0.1) * 0.3;
112:                    
113:                    if (p.life <= 0) {
114:                        m.gachaParticles.splice(i, 1);
115:                        continue;
116:                    }
117:                    
118:                    const alpha = p.life / 120;
119:                    ctx.save();
120:                    ctx.translate(p.x, p.y);
121:                    ctx.rotate(p.rotation);
122:                    ctx.scale(p.scale, p.scale);
123:                    
124:                    // Star shape
125:                    ctx.beginPath();
126:                    for(let j = 0; j < 5; j++) {
127:                        const angle = (Math.PI * 2 / 5) * j - Math.PI / 2;
128:                        const radius = j % 2 === 0 ? 8 : 4;
129:                        const px = Math.cos(angle) * radius;
130:                        const py = Math.sin(angle) * radius;
131:                        if(j === 0) ctx.moveTo(px, py);
132:                        else ctx.lineTo(px, py);
133:                    }
134:                    ctx.closePath();
135:                    ctx.fillStyle = `rgba(${p.color}, ${alpha})`;
136:                    ctx.fill();
137:                    ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
138:                    ctx.lineWidth = 2;
139:                    ctx.stroke();
140:                    
141:                    ctx.restore();
142:                }
143:                
144:                // Draw star bursts
145:                for(let i = m.gachaStars.length - 1; i >= 0; i--) {
146:                    const s = m.gachaStars[i];
147:                    s.life--;
148:                    s.radius += s.expansion;
149:                    
150:                    if(s.life <= 0) {
151:                        m.gachaStars.splice(i, 1);
152:                        continue;
153:                    }
154:                    
155:                    const alpha = s.life / 60;
156:                    ctx.save();
157:                    ctx.translate(s.x, s.y);
158:                    
159:                    for(let j = 0; j < 8; j++) {
160:                        const angle = (Math.PI * 2 / 8) * j + s.rotation;
161:                        ctx.beginPath();
162:                        ctx.moveTo(0, 0);
163:                        ctx.lineTo(Math.cos(angle) * s.radius, Math.sin(angle) * s.radius);
164:                        ctx.strokeStyle = `hsla(${s.hue}, 100%, 60%, ${alpha})`;
165:                        ctx.lineWidth = 4;
166:                        ctx.stroke();
167:                    }
168:                    
169:                    s.rotation += 0.1;
170:                    ctx.restore();
171:                }
172:                
173:                // Draw energy rays
174:                for(let i = m.gachaRays.length - 1; i >= 0; i--) {
175:                    const r = m.gachaRays[i];
176:                    r.life--;
177:                    r.length += r.speed;
178:                    
179:                    if(r.life <= 0) {
180:                        m.gachaRays.splice(i, 1);
181:                        continue;
182:                    }
183:                    
184:                    const alpha = r.life / 90;
185:                    ctx.save();
186:                    ctx.translate(r.x, r.y);
187:                    ctx.rotate(r.angle);
188:                    
189:                    const gradient = ctx.createLinearGradient(0, 0, r.length, 0);
190:                    gradient.addColorStop(0, `hsla(${r.hue}, 100%, 60%, ${alpha})`);
191:                    gradient.addColorStop(1, 'transparent');
192:                    
193:                    ctx.fillStyle = gradient;
194:                    ctx.fillRect(0, -r.width/2, r.length, r.width);
195:                    ctx.restore();
196:                }
197:                
198:                // Draw sparkle effects
199:                for(let i = m.gachaSparkles.length - 1; i >= 0; i--) {
200:                    const sp = m.gachaSparkles[i];
201:                    sp.life--;
202:                    
203:                    if(sp.life <= 0) {
204:                        m.gachaSparkles.splice(i, 1);
205:                        continue;
206:                    }
207:                    
208:                    const alpha = sp.life / 40;
209:                    const size = 3 + Math.sin(sp.life * 0.3) * 2;
210:                    
211:                    ctx.save();
212:                    ctx.translate(sp.x, sp.y);
213:                    ctx.rotate(sp.rotation);
214:                    
215:                    ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
216:                    ctx.fillRect(-size/2, -1, size, 2);
217:                    ctx.fillRect(-1, -size/2, 2, size);
218:                    
219:                    sp.rotation += 0.2;
220:                    ctx.restore();
221:                }
222:                
223:                // Roll gacha with spectacular effects
224:                if (input.field && m.fieldCDcycle < m.cycle && m.energy > 0.1 && !m.gachaRolling) {
225:                    m.energy -= 0.1;
226:                    m.fieldCDcycle = m.cycle + 60;
227:                    m.gachaRolling = true;
228:                    m.gachaEndCycle = m.cycle + 90;
229:                    
230:                    // Spawn massive particle effects
231:                    for (let i = 0; i < 100; i++) {
232:                        const angle = Math.random() * Math.PI * 2;
233:                        const speed = 8 + Math.random() * 15;
234:                        m.gachaParticles.push({
235:                            x: m.pos.x,
236:                            y: m.pos.y,
237:                            vx: Math.cos(angle) * speed,
238:                            vy: Math.sin(angle) * speed,
239:                            rotation: Math.random() * Math.PI * 2,
240:                            rotSpeed: (Math.random() - 0.5) * 0.3,
241:                            color: `${Math.floor(200 + Math.random() * 55)}, ${Math.floor(150 + Math.random() * 105)}, 0`,
242:                            life: 120,
243:                            scale: 1
244:                        });
245:                    }
246:                    
247:                    // Star bursts
248:                    for(let i = 0; i < 15; i++) {
249:                        m.gachaStars.push({
250:                            x: m.pos.x + (Math.random() - 0.5) * 100,
251:                            y: m.pos.y + (Math.random() - 0.5) * 100,
252:                            radius: 20,
253:                            expansion: 3,
254:                            rotation: Math.random() * Math.PI * 2,
255:                            hue: Math.random() * 360,
256:                            life: 60
257:                        });
258:                    }
259:                    
260:                    // Energy rays
261:                    for(let i = 0; i < 20; i++) {
262:                        m.gachaRays.push({
263:                            x: m.pos.x,
264:                            y: m.pos.y,
265:                            angle: (Math.PI * 2 / 20) * i,
266:                            length: 0,
267:                            speed: 15,
268:                            width: 8,
269:                            hue: (360 / 20) * i,
270:                            life: 90
271:                        });
272:                    }
273:                    
274:                    // Giant rotating circle
275:                    for(let r = 0; r < 5; r++) {
276:                        simulation.drawList.push({
277:                            x: m.pos.x,
278:                            y: m.pos.y,
279:                            radius: 150 - r * 30,
280:                            color: `hsla(${r * 72}, 100%, 60%, 0.4)`,
281:                            time: 90
282:                        });
283:                    }
284:                }
285:                
286:                // Process gacha result with massive rewards
287:                if (m.gachaRolling && m.cycle >= m.gachaEndCycle) {
288:                    m.gachaRolling = false;
289:                    
290:                    // Determine reward type and quantity
291:                    const roll = Math.random();
292:                    let rewardType, quantity;
293:                    
294:                    if (roll < 0.15) {
295:                        rewardType = "tech";
296:                        quantity = 3 + Math.floor(Math.random() * 3);
297:                    } else if (roll < 0.3) {
298:                        rewardType = "field";
299:                        quantity = 2 + Math.floor(Math.random() * 2);
300:                    } else if (roll < 0.45) {
301:                        rewardType = "gun";
302:                        quantity = 2 + Math.floor(Math.random() * 3);
303:                    } else if (roll < 0.7) {
304:                        rewardType = "research";
305:                        quantity = 5 + Math.floor(Math.random() * 5);
306:                    } else if (roll < 0.85) {
307:                        rewardType = "ammo";
308:                        quantity = 4 + Math.floor(Math.random() * 4);
309:                    } else {
310:                        rewardType = "heal";
311:                        quantity = 3 + Math.floor(Math.random() * 3);
312:                    }
313:                    
314:                    // Spawn rewards in spectacular fashion
315:                    for(let i = 0; i < quantity; i++) {
316:                        const angle = (Math.PI * 2 / quantity) * i;
317:                        const dist = 80 + Math.random() * 40;
318:                        const spawnX = m.pos.x + Math.cos(angle) * dist;
319:                        const spawnY = m.pos.y + Math.sin(angle) * dist;
320:                        
321:                        setTimeout(() => {
322:                            powerUps.spawn(spawnX, spawnY, rewardType, false);
323:                            
324:                            // Massive sparkle explosion per reward
325:                            for(let j = 0; j < 30; j++) {
326:                                m.gachaSparkles.push({
327:                                    x: spawnX + (Math.random() - 0.5) * 50,
328:                                    y: spawnY + (Math.random() - 0.5) * 50,
329:                                    rotation: Math.random() * Math.PI * 2,
330:                                    life: 40
331:                                });
332:                            }
333:                            
334:                            // Star burst at spawn
335:                            m.gachaStars.push({
336:                                x: spawnX,
337:                                y: spawnY,
338:                                radius: 30,
339:                                expansion: 5,
340:                                rotation: 0,
341:                                hue: Math.random() * 360,
342:                                life: 60
343:                            });
344:                        }, i * 100);
345:                    }
346:                    
347:                    // Console message with stars
348:                    const stars = "★".repeat(Math.min(quantity, 5));
349:                    simulation.inGameConsole(`<span style='color:#ffd700'>${stars} MEGA GACHA: ${quantity}x ${rewardType.toUpperCase()}! ${stars}</span>`);
350:                    
351:                    // Bonus coupling
352:                    m.couplingChange(quantity * 2);
353:                }
354:                
355:                // Draw gacha UI when rolling
356:                if (m.gachaRolling) {
357:                    const progress = 1 - ((m.gachaEndCycle - m.cycle) / 90);
358:                    
359:                    ctx.save();
360:                    ctx.translate(m.pos.x, m.pos.y - 120);
361:                    
362:                    // Mega spinning circle
363:                    for(let i = 0; i < 3; i++) {
364:                        ctx.rotate(m.cycle * 0.3 * (i % 2 === 0 ? 1 : -1));
365:                        ctx.strokeStyle = `hsla(${(m.cycle * 5 + i * 120) % 360}, 100%, 60%, 0.8)`;
366:                        ctx.lineWidth = 8;
367:                        ctx.beginPath();
368:                        ctx.arc(0, 0, 60 + i * 20, 0, Math.PI * 2 * progress);
369:                        ctx.stroke();
370:                    }
371:                    
372:                    ctx.restore();
373:                    
374:                    // Mega text
375:                    ctx.fillStyle = `hsla(${(m.cycle * 5) % 360}, 100%, 60%, 1)`;
376:                    ctx.font = "bold 32px Arial";
377:                    ctx.textAlign = "center";
378:                    ctx.shadowBlur = 20;
379:                    ctx.shadowColor = "#ffd700";
380:                    ctx.fillText("★ MEGA GACHA ★", m.pos.x, m.pos.y - 180);
381:                    ctx.shadowBlur = 0;
382:                }
383:                
384:                m.drawRegenEnergy();
385:            };
386:        }
387:    });
388:    
389:    console.log("%cUltimate Gacha Field loaded with spectacular effects!", "color: #ffd700; font-weight: bold; font-size: 18px;");
390:})();
391: