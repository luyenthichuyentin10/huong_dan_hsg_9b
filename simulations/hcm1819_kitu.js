/**
 * FILE MÔ PHỎNG: MA TRẬN BIT (MTBIT - HCM 18-19)
 * Tác giả: Gemini
 */

window.mtbit_N = 0;
window.mtbit_matrix = [];
window.mtbit_generator = null;
window.mtbit_auto_timer = null;

function init_hcm1819_mtbit_simulation() {
    const container = document.getElementById('simulation-area');
    if (!container) return;

    container.innerHTML = `
        <div class="step-card border-purple">
            <div class="step-badge bg-purple">Mô phỏng: Quét và So sánh chuỗi Nhị phân (MTBIT)</div>
            
            <div style="display: flex; gap: 15px; margin-bottom: 20px; align-items: flex-start; flex-wrap: wrap;">
                <div>
                    <textarea id="mtbit-input" style="width: 150px; height: 160px; padding: 5px; font-family: monospace; font-size: 1.1rem; letter-spacing: 2px;" placeholder="Dữ liệu ma trận...">010
101
001</textarea>
                </div>
                <div style="display: flex; flex-direction: column; gap: 10px; flex: 1;">
                    <div style="display: flex; gap: 10px;">
                        <button onclick="mtbit_random()" class="toggle-btn" style="background:#64748b; color:white; flex:1;">🎲 Test ngẫu nhiên</button>
                        <button onclick="mtbit_start()" class="toggle-btn" style="background:#0284c7; color:white; flex:1;">🚀 Nạp Dữ Liệu</button>
                    </div>
                    <div style="display: flex; gap: 10px;">
                        <button onclick="mtbit_step()" id="btn-mtbit-step" class="toggle-btn" style="background:#29c702; color:white; flex:1;" disabled>⏭ Quét tiếp</button>
                        <button onclick="mtbit_toggle_auto()" id="btn-mtbit-auto" class="toggle-btn" style="background:#8b5cf6; color:white; flex:1;" disabled>▶ Tự động</button>
                    </div>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 5px;">
                        <div style="background: #fffbeb; padding: 10px; border-radius: 8px; border: 1px solid #fef3c7; text-align: center;">
                            <div style="font-size:0.8rem; font-weight:bold; color:#92400e;">CHUỖI ĐANG XÉT (TỪ MA TRẬN)</div>
                            <div id="mtbit-curr" style="color:#ea580c; font-size: 1.8rem; font-weight: 900; font-family: monospace; letter-spacing: 3px;">-</div>
                        </div>
                        <div style="background: #f0fdf4; padding: 10px; border-radius: 8px; border: 1px solid #bbf7d0; text-align: center; display: flex; flex-direction: column; justify-content: center;">
                            <div style="font-size:0.8rem; font-weight:bold; color:#166534;">CHUỖI MAX HIỆN TẠI</div>
                            <div id="mtbit-max" style="color:#15803d; font-size: 2rem; font-weight: 900; font-family: monospace; letter-spacing: 3px;">-</div>
                        </div>
                    </div>
                </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                <div style="background: white; border: 1px solid #e2e8f0; border-radius: 8px; padding: 15px; display: flex; justify-content: center; align-items: center; min-height: 200px;">
                    <div id="mtbit-grid"></div>
                </div>

                <div id="mtbit-log" style="background: #1e1e1e; color: #d4d4d4; padding: 12px; border-radius: 8px; font-family: monospace; height: 200px; overflow-y: auto; font-size: 0.85rem; line-height: 1.5;">
                    > Nhập ma trận và nhấn Nạp...
                </div>
            </div>
        </div>
    `;
}

function mtbit_log(msg, color = "#d4d4d4") {
    const log = document.getElementById('mtbit-log');
    log.innerHTML += `<div style="color:${color}">> ${msg}</div>`;
    log.scrollTop = log.scrollHeight;
}

function mtbit_random() {
    const N = Math.floor(Math.random() * 4) + 4; // Ma trận từ 4x4 đến 7x7
    let text = "";
    for(let i=0; i<N; i++){
        let row = "";
        for(let j=0; j<N; j++){
            row += Math.random() > 0.5 ? "1" : "0";
        }
        text += row + "\n";
    }
    document.getElementById('mtbit-input').value = text.trim();
    mtbit_start();
}

function mtbit_start() {
    const lines = document.getElementById('mtbit-input').value.trim().split('\n');
    if (lines.length < 1) return;
    
    clearInterval(window.mtbit_auto_timer);
    document.getElementById('btn-mtbit-auto').innerHTML = "▶ Tự động";
    window.mtbit_auto_timer = null;

    window.mtbit_matrix = [];
    window.mtbit_N = lines[0].trim().length;
    
    try {
        for (let i = 0; i < window.mtbit_N; i++) {
            if (lines[i].trim().length !== window.mtbit_N) throw new Error();
            window.mtbit_matrix.push(lines[i].trim().split(''));
        }
    } catch(e) {
        alert("Lỗi đọc dữ liệu. Đảm bảo ma trận vuông đều đặn các số 0 và 1."); return;
    }

    let initial_max = "0".repeat(window.mtbit_N);
    document.getElementById('mtbit-curr').innerText = "-";
    document.getElementById('mtbit-max').innerText = initial_max;
    document.getElementById('mtbit-log').innerHTML = "";
    
    document.getElementById('btn-mtbit-step').disabled = false;
    document.getElementById('btn-mtbit-auto').disabled = false;
    
    mtbit_render_grid([]);
    window.mtbit_generator = logic_mtbit(initial_max);
    mtbit_log(`Đã nạp ma trận ${window.mtbit_N}x${window.mtbit_N}. Bắt đầu trích xuất...`, "#38bdf8");
}

function mtbit_render_grid(highlightCoords) {
    const container = document.getElementById('mtbit-grid');
    let html = `<table style="border-collapse: collapse; text-align: center; font-family: monospace; font-size: 1.5rem; font-weight: bold;">`;
    
    for(let i=0; i<window.mtbit_N; i++) {
        html += `<tr>`;
        for(let j=0; j<window.mtbit_N; j++) {
            let isHighlight = highlightCoords.some(c => c[0] === i && c[1] === j);
            let bg = isHighlight ? "#fef08a" : "white";
            let color = isHighlight ? "#b45309" : (window.mtbit_matrix[i][j] === '1' ? "#0f172a" : "#94a3b8");
            let border = isHighlight ? "2px solid #f59e0b" : "1px solid #cbd5e1";
            let scale = isHighlight ? "transform: scale(1.1);" : "";
            
            html += `<td style="width:40px; height:40px; background:${bg}; color:${color}; border:${border}; transition: all 0.2s; ${scale}">${window.mtbit_matrix[i][j]}</td>`;
        }
        html += `</tr>`;
    }
    html += `</table>`;
    container.innerHTML = html;
}

function* logic_mtbit(initial_max) {
    let N = window.mtbit_N;
    let max_str = initial_max;
    
    // Hàm phụ trợ so sánh
    function* process_and_compare(coords, label) {
        mtbit_render_grid(coords);
        let s = "";
        coords.forEach(c => s += window.mtbit_matrix[c[0]][c[1]]);
        
        document.getElementById('mtbit-curr').innerText = s;
        mtbit_log(`\nTrích xuất [${label}]: <b>${s}</b>`);
        yield; // Tạm dừng để xem chuỗi

        if (s > max_str) {
            max_str = s;
            document.getElementById('mtbit-max').innerText = max_str;
            mtbit_log(`-> Chuỗi <b>${s}</b> LỚN HƠN Max hiện tại. Cập nhật Max!`, "#10b981");
        } else {
            mtbit_log(`-> Bỏ qua. Không lớn hơn Max.`, "#64748b");
        }
        yield; // Tạm dừng sau khi cập nhật
    }

    // 1. Quét Hàng
    for (let i = 0; i < N; i++) {
        let coords = [];
        for (let j = 0; j < N; j++) coords.push([i, j]);
        yield* process_and_compare(coords, `Hàng ${i+1}`);
    }

    // 2. Quét Cột
    for (let j = 0; j < N; j++) {
        let coords = [];
        for (let i = 0; i < N; i++) coords.push([i, j]);
        yield* process_and_compare(coords, `Cột ${j+1}`);
    }

    // 3. Quét Chéo chính
    let coordsMain = [];
    for (let i = 0; i < N; i++) coordsMain.push([i, i]);
    yield* process_and_compare(coordsMain, `Chéo Chính`);

    // 4. Quét Chéo phụ
    let coordsAnti = [];
    for (let i = 0; i < N; i++) coordsAnti.push([i, N - 1 - i]);
    yield* process_and_compare(coordsAnti, `Chéo Phụ`);

    mtbit_render_grid([]); // Clear highlight
    document.getElementById('mtbit-curr').innerText = "-";
    mtbit_log(`\nHOÀN THÀNH! Chuỗi nhị phân lớn nhất tìm được là: <b>${max_str}</b>`, "#22c55e");
    
    document.getElementById('btn-mtbit-step').disabled = true;
    document.getElementById('btn-mtbit-auto').disabled = true;
    mtbit_toggle_auto(true);
}

function mtbit_step() {
    if (window.mtbit_generator) window.mtbit_generator.next();
}

function mtbit_toggle_auto(forceStop = false) {
    const btn = document.getElementById('btn-mtbit-auto');
    if (window.mtbit_auto_timer || forceStop) {
        clearInterval(window.mtbit_auto_timer);
        window.mtbit_auto_timer = null;
        if (!forceStop) btn.innerHTML = "▶ Tự động";
    } else {
        btn.innerHTML = "⏸ Tạm dừng";
        window.mtbit_auto_timer = setInterval(() => {
            if(window.mtbit_generator) {
                let res = window.mtbit_generator.next();
                if(res.done) mtbit_toggle_auto(true);
            }
        }, 1000); // 1 giây mỗi nhịp
    }
}