/**
 * FILE MÔ PHỎNG: TƯỚI RUỘNG (FARM - HCM 17-18)
 * Tác giả: Gemini
 */

window.farm_M = 0;
window.farm_N = 0;
window.farm_wells = [];
window.farm_grid = []; // Trạng thái: 'dry', 'watered', 'well', 'black'
window.farm_generator = null;
window.farm_auto_timer = null;

function init_hcm1718_farm_simulation() {
    const container = document.getElementById('simulation-area');
    if (!container) return;

    container.innerHTML = `
        <div class="step-card border-purple">
            <div class="step-badge bg-purple">Mô phỏng Đánh dấu Mảng 2D (Tưới ruộng)</div>
            
            <div style="display: flex; gap: 15px; margin-bottom: 15px; align-items: flex-start; flex-wrap: wrap;">
                <div>
                    <textarea id="farm-input" style="width: 200px; height: 160px; padding: 5px; font-family: monospace;" placeholder="Nhập M N&#10;K&#10;Tọa độ K giếng...">6 9
3
2 6
3 2
5 7</textarea>
                </div>
                <div style="display: flex; flex-direction: column; gap: 8px;">
                    <div style="display: flex; gap: 10px;">
                        <button onclick="farm_random()" class="toggle-btn" style="background:#64748b; color:white; flex:1;">🎲 Ngẫu nhiên</button>
                        <button onclick="farm_start()" class="toggle-btn" style="background:#0284c7; color:white; flex:1;">🚀 Nạp Dữ Liệu</button>
                    </div>
                    <div style="display: flex; gap: 10px;">
                        <button onclick="farm_step()" id="btn-farm-step" class="toggle-btn" style="background:#29c702; color:white; flex:1;" disabled>⏭ Quét 1 Giếng</button>
                        <button onclick="farm_toggle_auto()" id="btn-farm-auto" class="toggle-btn" style="background:#8b5cf6; color:white; flex:1;" disabled>▶ Tự động</button>
                    </div>
                    
                    <div style="background: #fffbeb; padding: 10px; border-radius: 8px; border: 1px solid #fef3c7; text-align: center; margin-top: 5px;">
                        <div style="font-size:0.85rem; font-weight:bold; color:#92400e;">SỐ THỬA RUỘNG KHÔ HẠN</div>
                        <div id="farm-res" style="color:#111827; font-size: 2rem; font-weight: 900;">0</div>
                    </div>
                </div>
            </div>

            <div style="display: grid; grid-template-columns: 1.5fr 1fr; gap: 20px;">
                <div style="background: white; border: 1px solid #e2e8f0; border-radius: 8px; padding: 15px; overflow-x: auto;">
                    <div id="farm-grid-display" style="display: flex; justify-content: center;"></div>
                </div>

                <div id="farm-log" style="background: #1e1e1e; color: #d4d4d4; padding: 12px; border-radius: 8px; font-family: monospace; height: 300px; overflow-y: auto; font-size: 0.8rem; line-height: 1.5;">
                    > Nhập ma trận và nhấn Nạp Dữ Liệu...
                </div>
            </div>
        </div>
    `;
}

function farm_log(msg, color = "#d4d4d4") {
    const log = document.getElementById('farm-log');
    log.innerHTML += `<div style="color:${color}">> ${msg}</div>`;
    log.scrollTop = log.scrollHeight;
}

function farm_random() {
    const M = Math.floor(Math.random() * 5) + 6; // 6 đến 10
    const N = Math.floor(Math.random() * 5) + 6; // 6 đến 10
    const K = Math.floor(Math.random() * 4) + 2; // 2 đến 5 giếng
    
    let text = `${M} ${N}\n${K}\n`;
    for(let i=0; i<K; i++){
        let r = Math.floor(Math.random() * M) + 1;
        let c = Math.floor(Math.random() * N) + 1;
        text += `${r} ${c}\n`;
    }
    
    document.getElementById('farm-input').value = text.trim();
    farm_start();
}

function farm_start() {
    const lines = document.getElementById('farm-input').value.trim().split('\n');
    if (lines.length < 2) return;
    
    clearInterval(window.farm_auto_timer);
    document.getElementById('btn-farm-auto').innerHTML = "▶ Tự động";
    window.farm_auto_timer = null;

    try {
        const [M, N] = lines[0].trim().split(/\s+/).map(Number);
        const K = parseInt(lines[1].trim());
        
        window.farm_M = M;
        window.farm_N = N;
        window.farm_wells = [];
        window.farm_grid = Array.from({length: M}, () => Array(N).fill('dry'));
        
        for (let i = 2; i < 2 + K; i++) {
            if (lines[i]) {
                const [r, c] = lines[i].trim().split(/\s+/).map(Number);
                if (r > 0 && r <= M && c > 0 && c <= N) {
                    window.farm_wells.push({r: r - 1, c: c - 1}); // Chuyển về index 0-based
                    window.farm_grid[r - 1][c - 1] = 'well';
                }
            }
        }
    } catch(e) {
        alert("Lỗi đọc dữ liệu. Đảm bảo đúng định dạng.");
        return;
    }

    document.getElementById('farm-res').innerText = "0";
    document.getElementById('farm-log').innerHTML = "";
    document.getElementById('btn-farm-step').disabled = false;
    document.getElementById('btn-farm-auto').disabled = false;
    
    farm_render();
    window.farm_generator = logic_farm();
    farm_log(`Đã nạp bản đồ ${window.farm_M}x${window.farm_N} với ${window.farm_wells.length} giếng.`, "#38bdf8");
}

function farm_render(highlightArea = null) {
    let html = `<table style="border-collapse: collapse; margin: 0 auto; user-select: none;">`;
    for(let i = 0; i < window.farm_M; i++) {
        html += `<tr>`;
        for(let j = 0; j < window.farm_N; j++) {
            let state = window.farm_grid[i][j];
            
            let bg = "#fef3c7"; // dry (vàng đất nhạt)
            let border = "1px solid #d1d5db";
            let content = "";
            
            if (state === 'well') {
                bg = "#3b82f6"; // Giếng (xanh dương đậm)
                content = "◎";
            } else if (state === 'watered') {
                bg = "#bae6fd"; // Nước lan ra (xanh dương nhạt)
            } else if (state === 'black') {
                bg = "#111827"; // Ô không tưới được (Đen/Xám đậm)
            }
            
            // Highlight vùng đang được quét
            if (highlightArea && i >= highlightArea.minR && i <= highlightArea.maxR && j >= highlightArea.minC && j <= highlightArea.maxC) {
                border = "2px solid #0284c7";
            }

            html += `<td style="width:25px; height:25px; text-align:center; background:${bg}; border:${border}; color:white; font-size:0.8rem; transition: background 0.3s;">${content}</td>`;
        }
        html += `</tr>`;
    }
    html += `</table>`;
    document.getElementById('farm-grid-display').innerHTML = html;
}

function* logic_farm() {
    let M = window.farm_M;
    let N = window.farm_N;
    
    // Quét từng giếng
    for (let k = 0; k < window.farm_wells.length; k++) {
        let r = window.farm_wells[k].r;
        let c = window.farm_wells[k].c;
        
        let minR = Math.max(0, r - 2);
        let maxR = Math.min(M - 1, r + 2);
        let minC = Math.max(0, c - 2);
        let maxC = Math.min(N - 1, c + 2);

        farm_log(`\nĐang xét giếng ${k+1} tại tọa độ (${r+1}, ${c+1})`, "#fbbf24");
        farm_render({minR, maxR, minC, maxC});
        yield; // Chờ nhịp để hiển thị viền highlight
        
        for (let i = minR; i <= maxR; i++) {
            for (let j = minC; j <= maxC; j++) {
                if (window.farm_grid[i][j] !== 'well') {
                    window.farm_grid[i][j] = 'watered';
                }
            }
        }
        
        farm_log(`-> Đã tưới xong vùng bán kính 2 ô quanh giếng ${k+1}.`, "#10b981");
        farm_render();
        yield; // Chờ nhịp để xem nước đổi màu
    }

    // Đếm số ô khô
    farm_log(`\nĐang kiểm đếm các ô khô hạn...`, "#c084fc");
    let dry_count = 0;
    for (let i = 0; i < M; i++) {
        for (let j = 0; j < N; j++) {
            if (window.farm_grid[i][j] === 'dry') {
                window.farm_grid[i][j] = 'black'; // Đổi thành màu đen giống đề bài
                dry_count++;
            }
        }
    }
    
    farm_render();
    document.getElementById('farm-res').innerText = dry_count;
    farm_log(`HOÀN THÀNH! Có ${dry_count} thửa ruộng không được tưới.`, "#ef4444");
    
    document.getElementById('btn-farm-step').disabled = true;
    document.getElementById('btn-farm-auto').disabled = true;
    farm_toggle_auto(true);
}

function farm_step() {
    if (window.farm_generator) {
        window.farm_generator.next();
    }
}

function farm_toggle_auto(forceStop = false) {
    const btn = document.getElementById('btn-farm-auto');
    if (window.farm_auto_timer || forceStop) {
        clearInterval(window.farm_auto_timer);
        window.farm_auto_timer = null;
        if (!forceStop) btn.innerHTML = "▶ Tự động";
    } else {
        btn.innerHTML = "⏸ Tạm dừng";
        window.farm_auto_timer = setInterval(() => {
            if(window.farm_generator) {
                let res = window.farm_generator.next();
                if(res.done) farm_toggle_auto(true);
            }
        }, 800); // Tốc độ quét chậm một chút để dễ quan sát nước loang ra
    }
}