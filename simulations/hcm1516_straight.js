/**
 * FILE MÔ PHỎNG: ĐƯỜNG THẲNG (STRAIGHT - HCM 15-16)
 * Tác giả: Gemini
 */

window.str_N = 0;
window.str_points = [];
window.str_slopes = new Set();
window.str_generator = null;
window.str_auto_timer = null;

function init_hcm1516_straight_simulation() {
    const container = document.getElementById('simulation-area');
    if (!container) return;

    container.innerHTML = `
        <div class="step-card border-purple">
            <div class="step-badge bg-purple">Mô phỏng: Lọc đường thẳng song song bằng Độ dốc</div>
            
            <div style="display: flex; gap: 15px; margin-bottom: 15px; align-items: flex-start; flex-wrap: wrap;">
                <div>
                    <textarea id="str-input" style="width: 120px; height: 160px; padding: 5px; font-family: monospace;" placeholder="Nhập N&#10;Tọa độ X Y...">4
-1 1
-2 0
0 0
1 1</textarea>
                </div>
                <div style="display: flex; flex-direction: column; gap: 10px; flex: 1;">
                    <div style="display: flex; gap: 10px;">
                        <button onclick="str_random()" class="toggle-btn" style="background:#64748b; color:white; flex:1;">🎲 Test ngẫu nhiên</button>
                        <button onclick="str_start()" class="toggle-btn" style="background:#0284c7; color:white; flex:1;">🚀 Nạp Dữ Liệu</button>
                    </div>
                    <div style="display: flex; gap: 10px;">
                        <button onclick="str_step()" id="btn-str-step" class="toggle-btn" style="background:#29c702; color:white; flex:1;" disabled>⏭ Nối 1 cặp điểm</button>
                        <button onclick="str_toggle_auto()" id="btn-str-auto" class="toggle-btn" style="background:#8b5cf6; color:white; flex:1;" disabled>▶ Tự động</button>
                    </div>
                    
                    <div style="display: grid; grid-template-columns: 1.5fr 1fr; gap: 10px; margin-top: 5px;">
                        <div style="background: #f8fafc; padding: 10px; border-radius: 8px; border: 1px solid #cbd5e1;">
                            <div style="font-size:0.8rem; font-weight:bold; color:#475569; margin-bottom:5px;">CÁC ĐỘ DỐC ĐÃ LƯU (SET)</div>
                            <div id="str-slope-set" style="font-family:monospace; font-size:0.85rem; color:#2563eb; display:flex; flex-wrap:wrap; gap:5px;">
                                [Trống]
                            </div>
                        </div>
                        <div style="background: #f0fdf4; padding: 10px; border-radius: 8px; border: 1px solid #22c55e; text-align: center; display: flex; flex-direction: column; justify-content: center;">
                            <div style="font-size:0.8rem; font-weight:bold; color:#166534;">SỐ ĐƯỜNG VẼ ĐƯỢC</div>
                            <div id="str-res" style="color:#15803d; font-size: 2rem; font-weight: 900;">0</div>
                        </div>
                    </div>
                </div>
            </div>

            <div style="background: white; border: 1px solid #e2e8f0; border-radius: 8px; padding: 15px; margin-bottom: 20px; position:relative; display:flex; justify-content:center; overflow:hidden;">
                <svg id="str-svg" width="100%" height="300" style="max-width: 600px; background-image: linear-gradient(to right, #f1f5f9 1px, transparent 1px), linear-gradient(to bottom, #f1f5f9 1px, transparent 1px); background-size: 20px 20px;"></svg>
            </div>

            <div id="str-log" style="background: #1e1e1e; color: #d4d4d4; padding: 12px; border-radius: 8px; font-family: monospace; height: 160px; overflow-y: auto; font-size: 0.85rem; line-height: 1.5;">
                > Nhập tọa độ và nhấn Nạp...
            </div>
        </div>
    `;
}

function str_log(msg, color = "#d4d4d4") {
    const log = document.getElementById('str-log');
    log.innerHTML += `<div style="color:${color}">> ${msg}</div>`;
    log.scrollTop = log.scrollHeight;
}

function str_gcd(a, b) {
    a = Math.abs(a);
    b = Math.abs(b);
    while (b !== 0) {
        let temp = b;
        b = a % b;
        a = temp;
    }
    return a;
}

function str_random() {
    const N = Math.floor(Math.random() * 4) + 4; // 4 đến 7 điểm cho dễ nhìn
    let text = `${N}\n`;
    for(let i=0; i<N; i++) {
        let x = Math.floor(Math.random() * 11) - 5; // -5 đến 5
        let y = Math.floor(Math.random() * 11) - 5;
        text += `${x} ${y}\n`;
    }
    document.getElementById('str-input').value = text.trim();
    str_start();
}

function str_start() {
    const lines = document.getElementById('str-input').value.trim().split('\n');
    if (lines.length < 2) return;
    
    clearInterval(window.str_auto_timer);
    document.getElementById('btn-str-auto').innerHTML = "▶ Tự động";
    window.str_auto_timer = null;

    try {
        window.str_N = parseInt(lines[0].trim());
        window.str_points = [];
        for (let i = 1; i <= window.str_N; i++) {
            if (lines[i]) {
                const [x, y] = lines[i].trim().split(/\s+/).map(Number);
                window.str_points.push({x, y, id: i});
            }
        }
    } catch(e) {
        alert("Lỗi đọc tọa độ."); return;
    }

    window.str_slopes.clear();
    document.getElementById('str-slope-set').innerHTML = "[Trống]";
    document.getElementById('str-res').innerText = "0";
    document.getElementById('str-log').innerHTML = "";
    
    document.getElementById('btn-str-step').disabled = false;
    document.getElementById('btn-str-auto').disabled = false;
    
    str_render_svg();
    window.str_generator = logic_str();
    str_log(`Đã nạp ${window.str_N} điểm. Bắt đầu nối từng cặp...`, "#38bdf8");
}

let svg_bounds = {minX: -6, maxX: 6, minY: -6, maxY: 6}; // Default bounds for visual scaling

function str_render_svg(activeLine = null, allLines = []) {
    const svg = document.getElementById('str-svg');
    let html = '';
    
    // Auto scale to fit points
    if (window.str_points.length > 0) {
        let xs = window.str_points.map(p => p.x);
        let ys = window.str_points.map(p => p.y);
        let minX = Math.min(...xs) - 2, maxX = Math.max(...xs) + 2;
        let minY = Math.min(...ys) - 2, maxY = Math.max(...ys) + 2;
        
        let range = Math.max(maxX - minX, maxY - minY);
        let midX = (minX + maxX)/2, midY = (minY + maxY)/2;
        
        svg_bounds.minX = midX - range/2;
        svg_bounds.maxX = midX + range/2;
        svg_bounds.minY = midY - range/2;
        svg_bounds.maxY = midY + range/2;
    }

    const {minX, maxX, minY, maxY} = svg_bounds;
    const w = maxX - minX, h = maxY - minY;
    svg.setAttribute('viewBox', `${minX} ${-maxY} ${w} ${h}`); // SVG Y is inverted

    // Draw grid axes
    html += `<line x1="${minX}" y1="0" x2="${maxX}" y2="0" stroke="#cbd5e1" stroke-width="${w*0.005}" />`;
    html += `<line x1="0" y1="${-maxY}" x2="0" y2="${-minY}" stroke="#cbd5e1" stroke-width="${w*0.005}" />`;

    // Draw all approved lines (faint)
    allLines.forEach(l => {
        html += `<line x1="${l.x1}" y1="${-l.y1}" x2="${l.x2}" y2="${-l.y2}" stroke="#dcfce7" stroke-width="${w*0.01}" stroke-linecap="round" />`;
    });

    // Draw active line testing
    if (activeLine) {
        let color = activeLine.isParallel ? "#ef4444" : "#10b981"; // Red if parallel, Green if new
        let dash = activeLine.isParallel ? `stroke-dasharray="${w*0.03}"` : "";
        html += `<line x1="${activeLine.x1}" y1="${-activeLine.y1}" x2="${activeLine.x2}" y2="${-activeLine.y2}" stroke="${color}" stroke-width="${w*0.015}" ${dash} stroke-linecap="round"/>`;
    }

    // Draw points
    window.str_points.forEach(p => {
        let isTesting = activeLine && ((p.x===activeLine.x1 && p.y===activeLine.y1) || (p.x===activeLine.x2 && p.y===activeLine.y2));
        let r = isTesting ? w*0.03 : w*0.02;
        let fill = isTesting ? "#f59e0b" : "#3b82f6";
        
        html += `<circle cx="${p.x}" cy="${-p.y}" r="${r}" fill="${fill}" />`;
        html += `<text x="${p.x + w*0.03}" y="${-p.y - w*0.03}" font-size="${w*0.05}" font-family="sans-serif" fill="#1e293b">P${p.id}</text>`;
    });

    svg.innerHTML = html;
}

function update_slope_ui() {
    const box = document.getElementById('str-slope-set');
    if (window.str_slopes.size === 0) { box.innerHTML = "[Trống]"; return; }
    
    let html = Array.from(window.str_slopes).map(s => 
        `<span style="background:#e0f2fe; padding:2px 6px; border-radius:4px; border:1px solid #93c5fd;">${s}</span>`
    ).join('');
    box.innerHTML = html;
    document.getElementById('str-res').innerText = window.str_slopes.size;
}

function* logic_str() {
    let N = window.str_N;
    let pts = window.str_points;
    let acceptedLines = [];

    for (let i = 0; i < N - 1; i++) {
        for (let j = i + 1; j < N; j++) {
            let p1 = pts[i], p2 = pts[j];
            let dx = p2.x - p1.x;
            let dy = p2.y - p1.y;
            
            let rawDx = dx, rawDy = dy;

            // Chuẩn hóa
            if (dx === 0) { dy = 1; }
            else if (dy === 0) { dx = 1; }
            else {
                let g = str_gcd(Math.abs(dx), Math.abs(dy));
                dx /= g; dy /= g;
                if (dx < 0) { dx = -dx; dy = -dy; }
            }

            let slopeStr = `${dy}/${dx}`;
            let isParallel = window.str_slopes.has(slopeStr);
            
            str_render_svg({x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y, isParallel: isParallel}, acceptedLines);
            
            str_log(`--- Nối P${p1.id} và P${p2.id} ---`, "#c084fc");
            str_log(`Tính Vector: dx=${rawDx}, dy=${rawDy}`);
            str_log(`Rút gọn độ dốc: <b>${slopeStr}</b>`);

            if (isParallel) {
                str_log(`=> LỖI: Độ dốc ${slopeStr} đã tồn tại trong Set. Cặp này tạo ra đường thẳng SONG SONG! Bỏ qua.`, "#ef4444");
            } else {
                window.str_slopes.add(slopeStr);
                acceptedLines.push({x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y});
                update_slope_ui();
                str_log(`=> HỢP LỆ: Lưu độ dốc ${slopeStr} vào tập hợp.`, "#10b981");
            }
            
            yield; // Tạm dừng
        }
    }
    str_render_svg(null, acceptedLines); // Draw final accepted only
    str_log(`\nHOÀN THÀNH! Bờm vẽ được tối đa ${window.str_slopes.size} đường thẳng không song song.`, "#fbbf24");
    
    document.getElementById('btn-str-step').disabled = true;
    document.getElementById('btn-str-auto').disabled = true;
    str_toggle_auto(true);
}

function str_step() {
    if (window.str_generator) {
        window.str_generator.next();
    }
}

function str_toggle_auto(forceStop = false) {
    const btn = document.getElementById('btn-str-auto');
    if (window.str_auto_timer || forceStop) {
        clearInterval(window.str_auto_timer);
        window.str_auto_timer = null;
        if (!forceStop) btn.innerHTML = "▶ Tự động";
    } else {
        btn.innerHTML = "⏸ Tạm dừng";
        window.str_auto_timer = setInterval(() => {
            if(window.str_generator) {
                let res = window.str_generator.next();
                if(res.done) str_toggle_auto(true);
            }
        }, 1000); 
    }
}