/**
 * FILE MÔ PHỎNG: VIỆT DÃ (MARATHON - HCM 15-16)
 * Tác giả: Gemini
 */

window.mara_M = 0;
window.mara_T = 0;
window.mara_U = 0;
window.mara_F = 0;
window.mara_D = 0;
window.mara_track = [];
window.mara_generator = null;
window.mara_auto_timer = null;

function init_hcm1516_marathon_simulation() {
    const container = document.getElementById('simulation-area');
    if (!container) return;

    container.innerHTML = `
        <div class="step-card border-purple">
            <div class="step-badge bg-purple">Mô phỏng: Tham lam thời gian chạy (MARATHON)</div>
            
            <div style="display: flex; gap: 15px; margin-bottom: 15px; align-items: flex-start; flex-wrap: wrap;">
                <div>
                    <textarea id="mara-input" style="width: 150px; height: 160px; padding: 5px; font-family: monospace;" placeholder="M T U F D&#10;Ký tự...">13 5 3 2 1
u
f
u
d
f</textarea>
                </div>
                <div style="display: flex; flex-direction: column; gap: 10px; flex: 1;">
                    <div style="display: flex; gap: 10px;">
                        <button onclick="mara_random()" class="toggle-btn" style="background:#64748b; color:white; flex:1;">🎲 Test ngẫu nhiên</button>
                        <button onclick="mara_start()" class="toggle-btn" style="background:#0284c7; color:white; flex:1;">🚀 Nạp Dữ Liệu</button>
                    </div>
                    <div style="display: flex; gap: 10px;">
                        <button onclick="mara_step()" id="btn-mara-step" class="toggle-btn" style="background:#29c702; color:white; flex:1;" disabled>⏭ Chạy 1 đoạn</button>
                        <button onclick="mara_toggle_auto()" id="btn-mara-auto" class="toggle-btn" style="background:#8b5cf6; color:white; flex:1;" disabled>▶ Tự động</button>
                    </div>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 5px;">
                        <div style="background: #fffbeb; padding: 10px; border-radius: 8px; border: 1px solid #fef3c7; text-align: center;">
                            <div style="font-size:0.8rem; font-weight:bold; color:#92400e;">THỜI GIAN ĐÃ DÙNG</div>
                            <div style="color:#ea580c; font-size: 1.8rem; font-weight: 900;"><span id="mara-time">0</span> / <span id="mara-time-max" style="font-size:1.2rem;">0</span></div>
                        </div>
                        <div style="background: #f0fdf4; padding: 10px; border-radius: 8px; border: 1px solid #bbf7d0; text-align: center;">
                            <div style="font-size:0.8rem; font-weight:bold; color:#166534;">QUÃNG ĐƯỜNG MAX</div>
                            <div id="mara-dist" style="color:#15803d; font-size: 1.8rem; font-weight: 900;">0</div>
                        </div>
                    </div>
                </div>
            </div>

            <div style="background: white; border: 1px solid #e2e8f0; border-radius: 8px; padding: 15px; margin-bottom: 20px; overflow-x: auto;">
                <div style="font-weight:bold; color:#475569; margin-bottom: 5px;">Mô phỏng địa hình lộ trình:</div>
                <svg id="mara-svg" height="150" style="width: 100%; min-width: 600px; background-image: linear-gradient(to right, #f8fafc 1px, transparent 1px), linear-gradient(to bottom, #f8fafc 1px, transparent 1px); background-size: 40px 40px;"></svg>
            </div>

            <div id="mara-log" style="background: #1e1e1e; color: #d4d4d4; padding: 12px; border-radius: 8px; font-family: monospace; height: 180px; overflow-y: auto; font-size: 0.85rem; line-height: 1.5;">
                > Nhập dữ liệu và nhấn Nạp...
            </div>
        </div>
    `;
}

function mara_log(msg, color = "#d4d4d4") {
    const log = document.getElementById('mara-log');
    log.innerHTML += `<div style="color:${color}">> ${msg}</div>`;
    log.scrollTop = log.scrollHeight;
}

function mara_random() {
    const M = Math.floor(Math.random() * 50) + 20; // 20 - 70
    const T = Math.floor(Math.random() * 8) + 8; // 8 - 15 đoạn
    const U = Math.floor(Math.random() * 5) + 2; 
    const F = Math.floor(Math.random() * 3) + 2; 
    const D = Math.floor(Math.random() * 2) + 1; 
    
    let text = `${M} ${T} ${U} ${F} ${D}\n`;
    const terrains = ['u', 'f', 'd'];
    for(let i=0; i<T; i++){
        text += terrains[Math.floor(Math.random() * 3)] + "\n";
    }
    document.getElementById('mara-input').value = text.trim();
    mara_start();
}

function mara_start() {
    const lines = document.getElementById('mara-input').value.trim().split(/\s+/);
    if (lines.length < 6) return;
    
    clearInterval(window.mara_auto_timer);
    document.getElementById('btn-mara-auto').innerHTML = "▶ Tự động";
    window.mara_auto_timer = null;

    try {
        window.mara_M = parseInt(lines[0]);
        window.mara_T = parseInt(lines[1]);
        window.mara_U = parseInt(lines[2]);
        window.mara_F = parseInt(lines[3]);
        window.mara_D = parseInt(lines[4]);
        
        window.mara_track = [];
        for (let i = 5; i < 5 + window.mara_T; i++) {
            if (lines[i]) window.mara_track.push(lines[i].toLowerCase());
        }
    } catch(e) {
        alert("Lỗi định dạng dữ liệu."); return;
    }

    document.getElementById('mara-time').innerText = "0";
    document.getElementById('mara-time-max').innerText = window.mara_M;
    document.getElementById('mara-dist').innerText = "0";
    document.getElementById('mara-log').innerHTML = "";
    
    document.getElementById('btn-mara-step').disabled = false;
    document.getElementById('btn-mara-auto').disabled = false;
    
    mara_render_svg(-1);
    window.mara_generator = logic_mara();
    mara_log(`Lộ trình dài ${window.mara_T} đơn vị. Thời gian tối đa: ${window.mara_M}s.`, "#38bdf8");
    mara_log(`Cost quy định: Lên (U)=${window.mara_U}s, Phẳng (F)=${window.mara_F}s, Xuống (D)=${window.mara_D}s`, "#94a3b8");
}

function mara_render_svg(activeIdx) {
    const svg = document.getElementById('mara-svg');
    let html = '';
    
    let x = 20;
    let y = 100; // Starting Y
    let stepX = 40;
    let stepY = 25;
    
    let points = `${x},${y} `;
    let segmentsData = [];

    // Tính toán tọa độ các điểm
    for(let i = 0; i < window.mara_T; i++) {
        let type = window.mara_track[i];
        let nextX = x + stepX;
        let nextY = y;
        
        if (type === 'u') nextY = y - stepY;
        else if (type === 'd') nextY = y + stepY;
        // if 'f', nextY remains y
        
        points += `${nextX},${nextY} `;
        segmentsData.push({x1: x, y1: y, x2: nextX, y2: nextY, type: type});
        x = nextX;
        y = nextY;
    }

    // Vẽ đường nền xám mờ
    html += `<polyline points="${points}" fill="none" stroke="#cbd5e1" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>`;
    
    // Vẽ từng đoạn (tô màu nếu đã đi qua)
    segmentsData.forEach((seg, idx) => {
        let color = idx <= activeIdx ? "#22c55e" : "transparent"; // Xanh lá nếu đã đi qua
        let thickness = idx <= activeIdx ? "6" : "0";
        if (idx === activeIdx + 1 && activeIdx !== window.mara_T - 1) {
            // Đoạn đang xét
            color = "#f59e0b"; // Cam
            thickness = "6";
        }
        
        html += `<line x1="${seg.x1}" y1="${seg.y1}" x2="${seg.x2}" y2="${seg.y2}" stroke="${color}" stroke-width="${thickness}" stroke-linecap="round" />`;
        
        // Label type
        let midX = (seg.x1 + seg.x2) / 2;
        let midY = Math.min(seg.y1, seg.y2) - 10;
        html += `<text x="${midX}" y="${midY}" font-family="monospace" font-size="14" fill="#64748b" text-anchor="middle">${seg.type.toUpperCase()}</text>`;
    });

    // Vẽ runner (Hình tròn hiển thị vị trí hiện tại)
    let currX = activeIdx >= 0 ? segmentsData[activeIdx].x2 : 20;
    let currY = activeIdx >= 0 ? segmentsData[activeIdx].y2 : 100;
    html += `<circle cx="${currX}" cy="${currY}" r="8" fill="#ef4444" stroke="white" stroke-width="2" />`;

    svg.innerHTML = html;
}

function* logic_mara() {
    let time_used = 0;
    let dist = 0;
    
    for (let i = 0; i < window.mara_T; i++) {
        let type = window.mara_track[i];
        let cost = 0;
        let breakdown = "";
        
        if (type === 'u') {
            cost = window.mara_U + window.mara_D;
            breakdown = `(Đi U=${window.mara_U} + Về D=${window.mara_D})`;
        } else if (type === 'd') {
            cost = window.mara_D + window.mara_U;
            breakdown = `(Đi D=${window.mara_D} + Về U=${window.mara_U})`;
        } else {
            cost = window.mara_F * 2;
            breakdown = `(Đi F=${window.mara_F} + Về F=${window.mara_F})`;
        }

        mara_render_svg(i - 1); // Highlight segment đang xét màu cam
        mara_log(`\nĐoạn ${i+1} [${type.toUpperCase()}]: Cần ${cost}s cho lượt đi+về ${breakdown}`, "#fbbf24");
        yield; // Tạm dừng để xem phân tích

        if (time_used + cost <= window.mara_M) {
            time_used += cost;
            dist++;
            document.getElementById('mara-time').innerText = time_used;
            document.getElementById('mara-dist').innerText = dist;
            mara_render_svg(i);
            mara_log(`-> ĐỦ THỜI GIAN! Tổng thời gian: ${time_used}s. Chạy thành công.`, "#10b981");
            yield; 
        } else {
            mara_log(`-> THIẾU THỜI GIAN! (${time_used} + ${cost} = ${time_used + cost} > ${window.mara_M}s).`, "#ef4444");
            mara_log(`=> Bờm phải dừng lại ở đoạn ${i} và quay về. Kết thúc.`, "#ef4444");
            break;
        }
    }

    mara_log(`\nHOÀN THÀNH! Quãng đường đi xa nhất là: ${dist} đơn vị.`, "#38bdf8");
    document.getElementById('btn-mara-step').disabled = true;
    document.getElementById('btn-mara-auto').disabled = true;
    mara_toggle_auto(true);
}

function mara_step() {
    if (window.mara_generator) {
        window.mara_generator.next();
    }
}

function mara_toggle_auto(forceStop = false) {
    const btn = document.getElementById('btn-mara-auto');
    if (window.mara_auto_timer || forceStop) {
        clearInterval(window.mara_auto_timer);
        window.mara_auto_timer = null;
        if (!forceStop) btn.innerHTML = "▶ Tự động";
    } else {
        btn.innerHTML = "⏸ Tạm dừng";
        window.mara_auto_timer = setInterval(() => {
            if(window.mara_generator) {
                let res = window.mara_generator.next();
                if(res.done) mara_toggle_auto(true);
            }
        }, 1200); // 1.2s để học sinh kịp đọc text breakdown thời gian
    }
}