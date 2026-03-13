/**
 * FILE MÔ PHỎNG: CHỌN QUÀ (CHONQUA - HCM 21-22)
 * Tác giả: Gemini
 */

window.cq_D = 0;
window.cq_R = 0;
window.cq_K = 0;
window.cq_A = [];
window.cq_P = [];
window.cq_generator = null;
window.cq_auto_timer = null;

function init_hcm2122_chonqua_simulation() {
    const container = document.getElementById('simulation-area');
    if (!container) return;

    container.innerHTML = `
        <div class="step-card border-purple">
            <div class="step-badge bg-purple">Mô phỏng: Quét Vợt & Mảng Cộng dồn 2D</div>
            
            <div style="display: flex; gap: 15px; margin-bottom: 20px; align-items: flex-start; flex-wrap: wrap;">
                <div>
                    <textarea id="cq-input" style="width: 150px; height: 160px; padding: 5px; font-family: monospace; font-size: 1rem; letter-spacing: 2px;" placeholder="Nhập D R K&#10;Ma trận...">7 6 4
. . . . . .
. * . * . *
. . . . . .
. * . * . .
. . * . . .
. . * . . .
* . . . . *</textarea>
                </div>
                <div style="display: flex; flex-direction: column; gap: 10px; flex: 1;">
                    <div style="display: flex; gap: 10px;">
                        <button onclick="cq_random()" class="toggle-btn" style="background:#64748b; color:white; flex:1;">🎲 Random Map</button>
                        <button onclick="cq_start()" class="toggle-btn" style="background:#0284c7; color:white; flex:1;">🚀 Nạp Dữ Liệu</button>
                    </div>
                    <div style="display: flex; gap: 10px;">
                        <button onclick="cq_step()" id="btn-cq-step" class="toggle-btn" style="background:#29c702; color:white; flex:1;" disabled>⏭ Quét tiếp</button>
                        <button onclick="cq_toggle_auto()" id="btn-cq-auto" class="toggle-btn" style="background:#8b5cf6; color:white; flex:1;" disabled>▶ Tự động</button>
                    </div>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 5px;">
                        <div style="background: #f0fdf4; padding: 10px; border-radius: 8px; border: 1px solid #bbf7d0; text-align: center;">
                            <div style="font-size:0.8rem; font-weight:bold; color:#166534;">QUÀ TẠI VỊ TRÍ ĐANG XÉT</div>
                            <div id="cq-curr-sum" style="color:#15803d; font-size: 2rem; font-weight: 900; font-family: monospace;">-</div>
                        </div>
                        <div style="background: #fffbeb; padding: 10px; border-radius: 8px; border: 1px solid #fef3c7; text-align: center;">
                            <div style="font-size:0.8rem; font-weight:bold; color:#92400e;">QUÀ MAX TÌM THẤY</div>
                            <div id="cq-max-sum" style="color:#b45309; font-size: 2rem; font-weight: 900; font-family: monospace;">0</div>
                        </div>
                    </div>
                </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px; overflow-x: auto;">
                <div style="background: white; border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px;">
                    <div style="font-size:0.8rem; font-weight:bold; color:#1e293b; margin-bottom:10px; text-align:center;">BẢN ĐỒ VƯỜN & KHUNG VỢT</div>
                    <div id="cq-grid-map" style="display: flex; justify-content: center;"></div>
                </div>

                <div style="background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 10px;">
                    <div style="font-size:0.8rem; font-weight:bold; color:#0284c7; margin-bottom:10px; text-align:center;">MẢNG CỘNG DỒN 2D (P)</div>
                    <div id="cq-grid-p" style="display: flex; justify-content: center;"></div>
                </div>
            </div>

            <div id="cq-log" style="background: #1e1e1e; color: #d4d4d4; padding: 12px; border-radius: 8px; font-family: monospace; height: 160px; overflow-y: auto; font-size: 0.85rem; line-height: 1.5;">
                > Nhập Map và nhấn Nạp...
            </div>
        </div>
    `;
}

function cq_log(msg, color = "#d4d4d4") {
    const log = document.getElementById('cq-log');
    log.innerHTML += `<div style="color:${color}">> ${msg}</div>`;
    log.scrollTop = log.scrollHeight;
}

function cq_random() {
    const D = 7;
    const R = 6;
    const K = Math.floor(Math.random() * 2) + 3; // 3 or 4
    let text = `${D} ${R} ${K}\n`;
    for(let i=0; i<D; i++){
        let row = [];
        for(let j=0; j<R; j++){
            row.push(Math.random() > 0.8 ? "*" : ".");
        }
        text += row.join(" ") + "\n";
    }
    document.getElementById('cq-input').value = text.trim();
    cq_start();
}

function cq_start() {
    const lines = document.getElementById('cq-input').value.trim().split('\n');
    if (lines.length < 2) return;
    
    clearInterval(window.cq_auto_timer);
    document.getElementById('btn-cq-auto').innerHTML = "▶ Tự động";
    window.cq_auto_timer = null;

    try {
        const [D, R, K] = lines[0].trim().split(/\s+/).map(Number);
        window.cq_D = D;
        window.cq_R = R;
        window.cq_K = K;
        
        window.cq_A = Array.from({length: D + 1}, () => Array(R + 1).fill(0));
        window.cq_P = Array.from({length: D + 1}, () => Array(R + 1).fill(0));

        for (let i = 1; i <= D; i++) {
            let chars = lines[i].trim().replace(/\s/g, '').split('');
            for (let j = 1; j <= R; j++) {
                if (chars[j-1] === '*') {
                    window.cq_A[i][j] = 1;
                }
            }
        }
    } catch(e) {
        alert("Lỗi đọc ma trận. Đảm bảo nhập đúng định dạng."); return;
    }

    // Build Prefix Sum
    for (let i = 1; i <= window.cq_D; i++) {
        for (let j = 1; j <= window.cq_R; j++) {
            window.cq_P[i][j] = window.cq_A[i][j] + window.cq_P[i-1][j] + window.cq_P[i][j-1] - window.cq_P[i-1][j-1];
        }
    }

    document.getElementById('cq-curr-sum').innerText = "-";
    document.getElementById('cq-max-sum').innerText = "0";
    document.getElementById('cq-log').innerHTML = "";
    
    document.getElementById('btn-cq-step').disabled = false;
    document.getElementById('btn-cq-auto').disabled = false;
    
    cq_render_grids(-1, -1);
    window.cq_generator = logic_cq();
    cq_log(`Đã nạp Lưới ${window.cq_D}x${window.cq_R}. Kích thước Vợt: ${window.cq_K}x${window.cq_K}. LÕI VỢT: ${window.cq_K - 2}x${window.cq_K - 2}`, "#38bdf8");
}

function cq_render_grids(vr, vc) {
    let D = window.cq_D, R = window.cq_R, K = window.cq_K;
    
    // RENDER MAP
    const mapContainer = document.getElementById('cq-grid-map');
    let mapHtml = `<table style="border-collapse: collapse; text-align: center; font-family: monospace; font-size: 1.2rem;">`;
    for (let i = 1; i <= D; i++) {
        mapHtml += `<tr>`;
        for (let j = 1; j <= R; j++) {
            let val = window.cq_A[i][j] === 1 ? '🎁' : '.';
            let bg = "white";
            let border = "1px solid #cbd5e1";
            
            if (vr !== -1) {
                let r2 = vr + K - 2, c2 = vc + K - 2;
                let isInside = (i >= vr + 1 && i <= r2 && j >= vc + 1 && j <= c2);
                let isBorder = (i >= vr && i <= vr + K - 1 && j >= vc && j <= vc + K - 1) && !isInside;
                
                if (isInside) {
                    bg = "#fef08a"; border = "2px solid #f59e0b"; // Lõi vàng
                } else if (isBorder) {
                    bg = "#f1f5f9"; border = "2px dashed #94a3b8"; // Viền xám
                    if (val === '🎁') val = '<span style="opacity:0.3">🎁</span>'; // Quà bị loại
                }
            }
            
            mapHtml += `<td style="width:30px; height:30px; background:${bg}; border:${border}; transition:all 0.2s;">${val}</td>`;
        }
        mapHtml += `</tr>`;
    }
    mapHtml += `</table>`;
    mapContainer.innerHTML = mapHtml;

    // RENDER P
    const pContainer = document.getElementById('cq-grid-p');
    let pHtml = `<table style="border-collapse: collapse; text-align: center; font-family: monospace; font-size: 0.9rem;">`;
    for (let i = 0; i <= D; i++) {
        pHtml += `<tr>`;
        for (let j = 0; j <= R; j++) {
            let bg = "white", color = "#475569", fw = "normal";
            let border = "1px solid #e2e8f0";
            
            if (vr !== -1) {
                let r2 = vr + K - 2, c2 = vc + K - 2;
                if (i === r2 && j === c2) { bg = "#bbf7d0"; color = "#166534"; fw="bold"; border="2px solid #22c55e"; } // P[r2][c2] (Cộng)
                else if (i === vr && j === vc) { bg = "#bbf7d0"; color = "#166534"; fw="bold"; border="2px solid #22c55e"; } // P[r1-1][c1-1] (Cộng)
                else if (i === r2 && j === vc) { bg = "#fecaca"; color = "#991b1b"; fw="bold"; border="2px solid #ef4444"; } // P[r2][c1-1] (Trừ)
                else if (i === vr && j === c2) { bg = "#fecaca"; color = "#991b1b"; fw="bold"; border="2px solid #ef4444"; } // P[r1-1][c2] (Trừ)
                else if (i >= vr && i <= r2 && j >= vc && j <= c2) { bg = "#f8fafc"; }
            }
            
            pHtml += `<td style="width:25px; height:25px; background:${bg}; color:${color}; font-weight:${fw}; border:${border}; transition:all 0.2s;">${window.cq_P[i][j]}</td>`;
        }
        pHtml += `</tr>`;
    }
    pHtml += `</table>`;
    pContainer.innerHTML = pHtml;
}

function* logic_cq() {
    let D = window.cq_D, R = window.cq_R, K = window.cq_K;
    let max_gifts = 0;

    for (let i = 1; i <= D - K + 1; i++) {
        for (let j = 1; j <= R - K + 1; j++) {
            let r2 = i + K - 2;
            let c2 = j + K - 2;
            
            cq_render_grids(i, j);
            cq_log(`\nĐặt vợt góc trái trên tại <b>(${i}, ${j})</b>`);
            cq_log(`Lõi nhặt quà từ (${i+1}, ${j+1}) đến (${r2}, ${c2})`);
            
            let p1 = window.cq_P[r2][c2];
            let p2 = window.cq_P[i][c2];
            let p3 = window.cq_P[r2][j];
            let p4 = window.cq_P[i][j];
            
            let sum = p1 - p2 - p3 + p4;
            document.getElementById('cq-curr-sum').innerText = sum;
            
            cq_log(`P[${r2}][${c2}] - P[${i}][${c2}] - P[${r2}][${j}] + P[${i}][${j}]`);
            cq_log(`= ${p1} - ${p2} - ${p3} + ${p4} = <b>${sum}</b> quà.`, "#c084fc");
            
            if (sum > max_gifts) {
                max_gifts = sum;
                document.getElementById('cq-max-sum').innerText = max_gifts;
                cq_log(`=> Kỷ lục mới: ${max_gifts} quà!`, "#10b981");
            }
            
            yield;
        }
    }

    cq_render_grids(-1, -1);
    cq_log(`\nHOÀN THÀNH! Số quà lớn nhất nhặt được là: ${max_gifts}`, "#fbbf24");
    
    document.getElementById('btn-cq-step').disabled = true;
    document.getElementById('btn-cq-auto').disabled = true;
    cq_toggle_auto(true);
}

function cq_step() {
    if (window.cq_generator) window.cq_generator.next();
}

function cq_toggle_auto(forceStop = false) {
    const btn = document.getElementById('btn-cq-auto');
    if (window.cq_auto_timer || forceStop) {
        clearInterval(window.cq_auto_timer);
        window.cq_auto_timer = null;
        if (!forceStop) btn.innerHTML = "▶ Tự động";
    } else {
        btn.innerHTML = "⏸ Tạm dừng";
        window.cq_auto_timer = setInterval(() => {
            if(window.cq_generator) {
                let res = window.cq_generator.next();
                if(res.done) cq_toggle_auto(true);
            }
        }, 1200); 
    }
}