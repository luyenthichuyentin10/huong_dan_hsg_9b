/**
 * FILE MÔ PHỎNG: DIỆN TÍCH PHỦ (XRECT - HCM 14-15)
 * Tác giả: Gemini 3 Flash
 */

window.xrect_data = [];
window.xrect_mode = "vetcan";
window.xrect_generator = null;
window.xrect_area = 0;
// Bounding box
window.xrect_bounds = { minX: 0, maxX: 0, minY: 0, maxY: 0 };

function init_hcm1415_xrect_simulation() {
    const container = document.getElementById('simulation-area');
    if (!container) return;

    container.innerHTML = `
        <div class="step-card border-purple">
            <div class="step-badge bg-purple">Mô phỏng Diện tích phủ (XRECT)</div>
            
            <div style="display: flex; gap: 15px; margin-bottom: 15px; align-items: center; flex-wrap: wrap;">
                <div>
                    <textarea id="xrect-input" style="width: 250px; height: 60px; padding: 5px; font-family: monospace;" placeholder="Nhập tọa độ: x1 y1 x2 y2&#10;0 3 4 0&#10;-1 1 4 0&#10;1 2 3 -1">0 3 4 0\n-1 1 4 0\n1 2 3 -1</textarea>
                </div>
                <div style="display: flex; flex-direction: column; gap: 8px;">
                    <select id="xrect-mode" style="padding:5px; border-radius:4px;">
                        <option value="vetcan">Cách 1: Đếm từng ô 1x1 (Vét cạn)</option>
                        <option value="nenden">Cách 2: Lưới Rời rạc hóa (Nén tọa độ)</option>
                    </select>
                    <div style="display: flex; gap: 10px;">
                        <button onclick="xrect_start()" class="toggle-btn" style="background:#0284c7; color:white;">🚀 Bắt đầu</button>
                        <button onclick="xrect_step()" id="btn-xrect-step" class="toggle-btn" style="background:#29c702; color:white;" disabled>⏭ Bước tiếp theo</button>
                    </div>
                </div>
            </div>

            <div style="display: grid; grid-template-columns: 1.5fr 1fr; gap: 20px;">
                <div style="background: white; border: 1px solid #e2e8f0; border-radius: 8px; position: relative; overflow: hidden; display: flex; align-items: center; justify-content: center; background-image: radial-gradient(#cbd5e1 1px, transparent 1px); background-size: 20px 20px;">
                    <svg id="xrect-svg" width="100%" height="300px" style="transform: scale(0.9);"></svg>
                </div>

                <div style="display: flex; flex-direction: column; gap: 15px;">
                    <div style="background: #fffbeb; padding: 15px; border-radius: 8px; border: 1px solid #fef3c7; text-align: center;">
                        <div style="font-size:0.85rem; font-weight:bold; color:#92400e;">TỔNG DIỆN TÍCH PHỦ</div>
                        <div id="xrect-res" style="color:#ea580c; font-size: 2.5rem; font-weight: 900;">0</div>
                    </div>
                    <div id="xrect-log" style="background: #1e1e1e; color: #d4d4d4; padding: 12px; border-radius: 8px; font-family: monospace; flex-grow: 1; overflow-y: auto; font-size: 0.85rem; max-height: 200px;">
                        > Nhập danh sách HCN và nhấn Bắt đầu...
                    </div>
                </div>
            </div>
        </div>
    `;
}

function xrect_log(msg, color = "#d4d4d4") {
    const log = document.getElementById('xrect-log');
    log.innerHTML += `<div style="color:${color}">> ${msg}</div>`;
    log.scrollTop = log.scrollHeight;
}

function xrect_start() {
    const lines = document.getElementById('xrect-input').value.trim().split('\n');
    window.xrect_data = [];
    window.xrect_area = 0;
    
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;

    lines.forEach(line => {
        let parts = line.trim().split(/\s+/).map(Number);
        if (parts.length === 4) {
            let [x1, y1, x2, y2] = parts;
            window.xrect_data.push({ x1, y1, x2, y2 });
            minX = Math.min(minX, x1, x2);
            maxX = Math.max(maxX, x1, x2);
            minY = Math.min(minY, y1, y2);
            maxY = Math.max(maxY, y1, y2);
        }
    });

    if (window.xrect_data.length === 0) return;

    // Margin cho viewBox
    minX -= 1; maxX += 1; minY -= 1; maxY += 1;
    window.xrect_bounds = { minX, maxX, minY, maxY };

    const svg = document.getElementById('xrect-svg');
    const vbW = maxX - minX;
    const vbH = maxY - minY;
    svg.setAttribute('viewBox', `${minX} ${-maxY} ${vbW} ${vbH}`);
    // SVG Y-axis is inverted (increases downwards). We use -maxY as origin and positive height.

    document.getElementById('xrect-res').innerText = "0";
    document.getElementById('xrect-log').innerHTML = "";
    document.getElementById('btn-xrect-step').disabled = false;
    window.xrect_mode = document.getElementById('xrect-mode').value;

    xrect_draw_base();

    if (window.xrect_mode === 'vetcan') window.xrect_generator = logic_vetcan();
    else window.xrect_generator = logic_nenden();

    xrect_step(); // Chạy ngay bước dựng khung
}

function xrect_draw_base() {
    const svg = document.getElementById('xrect-svg');
    const { minX, maxX, minY, maxY } = window.xrect_bounds;
    
    let html = '';
    // Draw axes
    html += `<line x1="${minX}" y1="0" x2="${maxX}" y2="0" stroke="#94a3b8" stroke-width="0.05" />`;
    html += `<line x1="0" y1="${-maxY}" x2="0" y2="${-minY}" stroke="#94a3b8" stroke-width="0.05" />`;

    // Draw rectangle outlines
    window.xrect_data.forEach((rect, idx) => {
        let w = rect.x2 - rect.x1;
        let h = rect.y1 - rect.y2;
        html += `<rect x="${rect.x1}" y="${-rect.y1}" width="${w}" height="${h}" fill="none" stroke="#3b82f6" stroke-width="0.08" stroke-dasharray="0.1" />`;
        // Text label
        html += `<text x="${rect.x1 + 0.1}" y="${-rect.y1 + 0.3}" font-size="0.3" fill="#2563eb">H${idx+1}</text>`;
    });

    svg.innerHTML = html;
}

function isInsideAny(x, y) {
    for (let rect of window.xrect_data) {
        if (x >= rect.x1 && x <= rect.x2 && y >= rect.y2 && y <= rect.y1) return true;
    }
    return false;
}

function* logic_vetcan() {
    const { minX, maxX, minY, maxY } = window.xrect_bounds;
    const svg = document.getElementById('xrect-svg');
    
    xrect_log(`[VÉT CẠN] Bắt đầu duyệt qua từng ô vuông 1x1...`, "#38bdf8");

    for (let x = Math.ceil(minX); x < Math.floor(maxX); x++) {
        for (let y = Math.floor(maxY); y > Math.ceil(minY); y--) {
            // Test center of 1x1 cell
            let cx = x + 0.5;
            let cy = y - 0.5;
            
            if (isInsideAny(cx, cy)) {
                window.xrect_area += 1;
                document.getElementById('xrect-res').innerText = window.xrect_area;
                
                // Draw filled 1x1 cell
                svg.innerHTML += `<rect x="${x}" y="${-(y)}" width="1" height="1" fill="#fef08a" stroke="#f59e0b" stroke-width="0.02" opacity="0.8" />`;
                xrect_log(`Phủ ô [${x}, ${y-1}]. Diện tích +1`, "#10b981");
                yield;
            }
        }
    }
    xrect_log(`HOÀN THÀNH VÉT CẠN! Tổng: ${window.xrect_area}`, "#fbbf24");
    document.getElementById('btn-xrect-step').disabled = true;
}

function* logic_nenden() {
    const svg = document.getElementById('xrect-svg');
    
    // Thu thập X, Y
    let setX = new Set(), setY = new Set();
    window.xrect_data.forEach(r => {
        setX.add(r.x1); setX.add(r.x2);
        setY.add(r.y1); setY.add(r.y2);
    });
    
    let cx = Array.from(setX).sort((a, b) => a - b);
    let cy = Array.from(setY).sort((a, b) => a - b);

    xrect_log(`[RỜI RẠC HÓA] Gom mảng X: [${cx.join(', ')}]`, "#38bdf8");
    xrect_log(`[RỜI RẠC HÓA] Gom mảng Y: [${cy.join(', ')}]`, "#38bdf8");
    yield;

    // Vẽ đường chia lưới không đều
    cx.forEach(x => {
        svg.innerHTML += `<line x1="${x}" y1="${-window.xrect_bounds.maxY}" x2="${x}" y2="${-window.xrect_bounds.minY}" stroke="#ef4444" stroke-width="0.03" stroke-dasharray="0.1" />`;
    });
    cy.forEach(y => {
        svg.innerHTML += `<line x1="${window.xrect_bounds.minX}" y1="${-y}" x2="${window.xrect_bounds.maxX}" y2="${-y}" stroke="#ef4444" stroke-width="0.03" stroke-dasharray="0.1" />`;
    });
    xrect_log("Đã tạo Lưới rời rạc từ các đường gióng tọa độ đỏ.", "#fbbf24");
    yield;

    // Duyệt qua các ô lưới lớn
    for (let i = 0; i < cx.length - 1; i++) {
        for (let j = 0; j < cy.length - 1; j++) {
            let width = cx[i+1] - cx[i];
            let height = cy[j+1] - cy[j];
            
            // Tâm của ô lưới này
            let midX = cx[i] + width / 2;
            let midY = cy[j] + height / 2;

            if (isInsideAny(midX, midY)) {
                let area = width * height;
                window.xrect_area += area;
                document.getElementById('xrect-res').innerText = window.xrect_area;
                
                svg.innerHTML += `<rect x="${cx[i]}" y="${-cy[j+1]}" width="${width}" height="${height}" fill="#86efac" stroke="#22c55e" stroke-width="0.05" opacity="0.8" />`;
                xrect_log(`Lấp đầy ô lưới từ X(${cx[i]}->${cx[i+1]}), Y(${cy[j]}->${cy[j+1]}). Diện tích +${area}`, "#10b981");
                yield;
            }
        }
    }
    
    xrect_log(`HOÀN THÀNH RỜI RẠC HÓA! Tổng: ${window.xrect_area}`, "#fbbf24");
    document.getElementById('btn-xrect-step').disabled = true;
}

function xrect_step() {
    if (window.xrect_generator) {
        window.xrect_generator.next();
    }
}