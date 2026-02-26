/**
 * FILE MÔ PHỎNG: LÀM VƯỜN (GIAO 3 HCN) - CÔNG NGHỆ SVG CHUYÊN NGHIỆP
 * Tên hàm: init_hcm0910_lamvuon_simulation
 */

window.lamvuon_hcnData = [];
window.lamvuon_sim = null;
window.lamvuon_gridSize = 12;

function init_hcm0910_lamvuon_simulation() {
    const container = document.getElementById('simulation-area');
    if (!container) return;

    container.innerHTML = `
        <div class="step-card border-purple">
            <div class="step-badge bg-purple">Mô phỏng trực quan chuẩn Oxy</div>
            
            <div class="control-panel" style="background: #f0f9ff; padding: 15px; border-radius: 8px; margin-bottom: 20px; border: 2px solid #bae6fd;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                    <b>Nhập tọa độ HCN (Phạm vi 0-11):</b>
                    <button onclick="lamvuon_rand()" class="toggle-btn" style="background:#64748b; font-size: 0.8rem; padding: 5px 10px;">🎲 Ngẫu nhiên</button>
                </div>
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;">
                    <div style="border-left: 4px solid #fef08a; padding-left: 10px; background: white; border-radius: 4px;">
                        <b style="color:#ca8a04">H1:</b></br> 
                        x1:<input type="number" id="lv_h1x1" value="2" style="width:35px"> y1:<input type="number" id="lv_h1y1" value="3" style="width:35px"><br>
                        x2:<input type="number" id="lv_h1x2" value="6" style="width:35px"> y2:<input type="number" id="lv_h1y2" value="7" style="width:35px">
                    </div>
                    <div style="border-left: 4px solid #fbbf24; padding-left: 10px; background: white; border-radius: 4px;">
                        <b style="color:#92400e">H2:</b></br>
                        x1:<input type="number" id="lv_h2x1" value="4" style="width:35px"> y1:<input type="number" id="lv_h2y1" value="1" style="width:35px"><br>
                        x2:<input type="number" id="lv_h2x2" value="8" style="width:35px"> y2:<input type="number" id="lv_h2y2" value="5" style="width:35px">
                    </div>
                    <div style="border-left: 4px solid #ef4444; padding-left: 10px; background: white; border-radius: 4px;">
                        <b style="color:#991b1b">H3:</b></br>
                        x1:<input type="number" id="lv_h3x1" value="6" style="width:35px"> y1:<input type="number" id="lv_h3y1" value="0" style="width:35px"><br>
                        x2:<input type="number" id="lv_h3x2" value="10" style="width:35px"> y2:<input type="number" id="lv_h3y2" value="3" style="width:35px">
                    </div>
                </div>
            </div>

            <div style="display: flex; gap: 10px; margin-bottom: 20px; align-items: center;">
                <select id="lv_method" class="toggle-btn" style="background:white; border: 1px solid #cbd5e1;">
                    <option value="vetcan">Cách 1: Vét cạn (Ma trận Lưới)</option>
                    <option value="hinhhoc">Cách 2: Hình học (Hệ trục Oxy)</option>
                </select>
                <button onclick="lamvuon_init()" class="toggle-btn" style="background:#0284c7; color:white;">🚀 Bắt đầu</button>
                <button onclick="lamvuon_next()" id="btn-step-lv" class="toggle-btn" style="background:#29c702; color:white;" disabled>⏭ Bước tiếp theo</button>
            </div>

            <div style="display: grid; grid-template-columns: 1.5fr 1fr; gap: 20px;">
                <div id="lv-visual-area" style="background: white; padding: 10px; border-radius: 8px; border: 1px solid #cbd5e1; min-height: 450px; display: flex; justify-content: center; align-items: center;">
                </div>
                <div style="display: flex; flex-direction: column; gap: 10px;">
                    <div id="lv-log" style="background: #1e1e1e; color: #d4d4d4; padding: 15px; border-radius: 8px; font-family: monospace; height: 320px; overflow-y: auto; font-size: 0.85rem;">
                        > Nhấn "Bắt đầu" để khởi tạo mô phỏng...
                    </div>
                    <div style="background: #f8fafc; padding: 15px; border: 1px solid #cbd5e1; border-radius: 8px; text-align: center;">
                        <b>Diện tích phần chung:</b><br>
                        <span id="lv-res" style="color:#c70202; font-size: 2rem; font-weight: 900;">0</span>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function lamvuon_rand() {
    for(let i=1; i<=3; i++) {
        let x1 = Math.floor(Math.random() * 5);
        let y1 = Math.floor(Math.random() * 5);
        document.getElementById(`lv_h${i}x1`).value = x1;
        document.getElementById(`lv_h${i}y1`).value = y1;
        document.getElementById(`lv_h${i}x2`).value = x1 + Math.floor(Math.random() * 4) + 2;
        document.getElementById(`lv_h${i}y2`).value = y1 + Math.floor(Math.random() * 4) + 2;
    }
}

function lamvuon_init() {
    window.lamvuon_hcnData = [];
    const colors = ['#fef08a', '#fbbf24', '#ef4444'];
    const borders = ['#ca8a04', '#92400e', '#991b1b'];
    
    for(let i=1; i<=3; i++) {
        window.lamvuon_hcnData.push({
            x1: parseInt(document.getElementById(`lv_h${i}x1`).value),
            y1: parseInt(document.getElementById(`lv_h${i}y1`).value),
            x2: parseInt(document.getElementById(`lv_h${i}x2`).value),
            y2: parseInt(document.getElementById(`lv_h${i}y2`).value),
            color: colors[i-1], borderColor: borders[i-1], label: `HCN ${i}`
        });
    }

    document.getElementById('lv-log').innerHTML = "";
    document.getElementById('lv-res').innerText = "0";
    document.getElementById('btn-step-lv').disabled = false;

    const method = document.getElementById('lv_method').value;
    window.lamvuon_sim = (method === "vetcan") ? lamvuon_vetcanGen() : lamvuon_svgGen();
    window.lamvuon_sim.next();
}

/**
 * MÔ PHỎNG HÌNH HỌC BẰNG SVG (Thay thế GeoGebra)
 */
function* lamvuon_svgGen() {
    const visual = document.getElementById('lv-visual-area');
    const logArea = document.getElementById('lv-log');
    const S = 35; // Scale: 35px mỗi đơn vị
    const padding = 40;
    const width = 12 * S + padding * 2;
    const height = 11 * S + padding * 2;

    // Vẽ hệ trục tọa độ Oxy
    const createSVG = () => {
        let svg = `<svg width="100%" height="450" viewBox="0 0 ${width} ${height}" style="max-width:550px">`;
        // Vẽ lưới (Grid)
        for(let i=0; i<=12; i++) {
            svg += `<line x1="${padding + i*S}" y1="${padding}" x2="${padding + i*S}" y2="${height-padding}" stroke="#e2e8f0" stroke-width="1" />`;
            svg += `<text x="${padding + i*S}" y="${height-padding+20}" font-size="12" text-anchor="middle" fill="#64748b">${i}</text>`;
        }
        for(let j=0; j<=11; j++) {
            svg += `<line x1="${padding}" y1="${height-padding - j*S}" x2="${width-padding}" y2="${height-padding - j*S}" stroke="#e2e8f0" stroke-width="1" />`;
            svg += `<text x="${padding-15}" y="${height-padding - j*S + 5}" font-size="12" text-anchor="end" fill="#64748b">${j}</text>`;
        }
        // Trục chính
        svg += `<line x1="${padding}" y1="${height-padding}" x2="${width-padding}" y2="${height-padding}" stroke="#334155" stroke-width="2" />`; // Ox
        svg += `<line x1="${padding}" y1="${padding}" x2="${padding}" y2="${height-padding}" stroke="#334155" stroke-width="2" />`; // Oy
        return svg;
    };

    let currentSvgContent = createSVG();
    visual.innerHTML = currentSvgContent + "</svg>";
    yield;

    let xL = -Infinity, xR = Infinity, yB = -Infinity, yT = Infinity;

    for(let k=0; k<3; k++) {
        let h = window.lamvuon_hcnData[k];
        let old = {xL, xR, yB, yT};
        
        xL = Math.max(xL === -Infinity ? -Infinity : xL, h.x1);
        xR = Math.min(xR === Infinity ? Infinity : xR, h.x2);
        yB = Math.max(yB === -Infinity ? -Infinity : yB, h.y1);
        yT = Math.min(yT === Infinity ? Infinity : yT, h.y2);

        // Thêm HCN vào SVG
        const rectX = padding + h.x1 * S;
        const rectY = height - padding - h.y2 * S;
        const rectW = (h.x2 - h.x1) * S;
        const rectH = (h.y2 - h.y1) * S;
        
        currentSvgContent += `<rect x="${rectX}" y="${rectY}" width="${rectW}" height="${rectH}" fill="${h.color}" stroke="${h.borderColor}" stroke-width="3" fill-opacity="0.5" />`;
        visual.innerHTML = currentSvgContent + "</svg>";

        logArea.innerHTML += `
            <div style="color:${h.borderColor}; border-bottom:1px solid #333; margin-bottom:5px; padding-bottom:5px;">
                > <b>Xét ${h.label}:</b> (${h.x1},${h.y1}) -> (${h.x2},${h.y2})<br>
                Miền giao tạm: X[${xL===-Infinity?h.x1:xL}, ${xR===Infinity?h.x2:xR}], Y[${yB===-Infinity?h.y1:yB}, ${yT===-Infinity?h.y2:yT}]
            </div>`;
        yield;
    }

    let w = Math.max(0, xR - xL), h_rect = Math.max(0, yT - yB);
    let area = w * h_rect;

    if(area > 0) {
        const resX = padding + xL * S;
        const resY = height - padding - yT * S;
        // Vẽ viền đen đậm cho phần chung và nhãn tọa độ
        currentSvgContent += `<rect x="${resX}" y="${resY}" width="${w*S}" height="${h_rect*S}" fill="black" fill-opacity="0.3" stroke="black" stroke-width="4" stroke-dasharray="5,3" />`;
        currentSvgContent += `<circle cx="${resX}" cy="${height-padding-yB*S}" r="4" fill="black" />`;
        currentSvgContent += `<text x="${resX-5}" y="${height-padding-yB*S+15}" font-weight="bold" font-size="13">P1(${xL},${yB})</text>`;
        currentSvgContent += `<circle cx="${padding+xR*S}" cy="${resY}" r="4" fill="black" />`;
        currentSvgContent += `<text x="${padding+xR*S+5}" y="${resY-10}" font-weight="bold" font-size="13">P2(${xR},${yT})</text>`;
        
        logArea.innerHTML += `<div style="color:#10b981; font-weight:bold;">> KẾT QUẢ: Diện tích = ${w} x ${h_rect} = ${area}</div>`;
    } else {
        logArea.innerHTML += `<div style="color:#ef4444; font-weight:bold;">> KẾT QUẢ: Không có miền giao chung.</div>`;
    }
    visual.innerHTML = currentSvgContent + "</svg>";
    document.getElementById('lv-res').innerText = area;
}

/**
 * CÁCH 1: VÉT CẠN (MA TRẬN LƯỚI)
 */
function* lamvuon_vetcanGen() {
    let grid = Array.from({length: window.lamvuon_gridSize}, () => Array(window.lamvuon_gridSize).fill(0));
    const visual = document.getElementById('lv-visual-area');
    
    const render = () => {
    let html = '<table class="garden-table" style="font-size:0.7rem; margin:auto; border-collapse: collapse; table-layout: fixed;">';
    
    // 1. Chỉnh ô tiêu đề góc Y\X (Thêm height: 30px)
    html += '<tr><td style="background:#f1f5f9; font-weight:bold; color:#64748b; width:30px; height:30px; border:1px solid #cbd5e1; text-align:center">Y\\X</td>';
    
    // 2. Các ô chỉ số X (Đã có width và height 30px)
    for(let x=0; x<window.lamvuon_gridSize; x++) {
        html += `<td style="background:#f1f5f9; font-weight:bold; color:#64748b; border:1px solid #cbd5e1; width:30px; height:30px; text-align:center">${x}</td>`;
    }
    html += '</tr>';
    
    for (let y = window.lamvuon_gridSize - 1; y >= 0; y--) {
        // 3. Chỉnh ô chỉ số Y (Thêm height: 30px và width: 30px)
        html += `<tr><td style="background:#f1f5f9; font-weight:bold; color:#64748b; border:1px solid #cbd5e1; width:30px; height:30px; text-align:center">${y}</td>`;
        
        for (let x = 0; x < window.lamvuon_gridSize; x++) {
            let v = grid[y][x];
            let bg = v === 1 ? "#fef08a" : (v === 2 ? "#fbbf24" : (v === 3 ? "#ef4444" : "white"));
            // 4. Các ô dữ liệu (Đã có width và height 30px)
            html += `<td style="background:${bg}; border:1px solid #cbd5e1; width:30px; height:30px; text-align:center; color:${v===3?'white':'black'}">${v||''}</td>`;
        }
        html += '</tr>';
    }
    visual.innerHTML = html + '</table>';
};
    
    render(); yield;

    for(let k=0; k<3; k++) {
        let h = window.lamvuon_hcnData[k];
        document.getElementById('lv-log').innerHTML += `<div style="color:${h.borderColor}">> Quét ${h.label}: x[${h.x1},${h.x2}], y[${h.y1},${h.y2}]</div>`;
        for(let i = h.y1; i < h.y2; i++) {
            for(let j = h.x1; j < h.x2; j++) {
                if(i >= 0 && i < window.lamvuon_gridSize && j >= 0 && j < window.lamvuon_gridSize) grid[i][j]++;
            }
        }
        render(); yield;
    }

    let count = 0;
    grid.forEach(row => row.forEach(v => { if(v===3) count++; }));
    document.getElementById('lv-res').innerText = count;
}

function lamvuon_next() {
    if (window.lamvuon_sim) {
        const res = window.lamvuon_sim.next();
        if (res.done) document.getElementById('btn-step-lv').disabled = true;
    }
}