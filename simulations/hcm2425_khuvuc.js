/**
 * FILE MÔ PHỎNG: KHU VỰC (KHUVUC - HCM 24-25)
 * Tác giả: Gemini
 */

window.kv_N = 0;
window.kv_A = [];
window.kv_Pref = [];
window.kv_Suff = [];
window.kv_mode = 'sub3';
window.kv_generator = null;
window.kv_auto_timer = null;

function init_hcm2425_khuvuc_simulation() {
    const container = document.getElementById('simulation-area');
    if (!container) return;

    container.innerHTML = `
        <div class="step-card border-purple">
            <div class="step-badge bg-purple">Mô phỏng: Prefix & Suffix GCD</div>
            
            <div style="display: flex; gap: 15px; margin-bottom: 20px; align-items: flex-start; flex-wrap: wrap;">
                <div>
                    <textarea id="kv-input" style="width: 150px; height: 100px; padding: 5px; font-family: monospace; font-size: 1.1rem; text-align:center;" placeholder="N&#10;Mảng Thẻ">3
4 2 8</textarea>
                </div>
                <div style="display: flex; flex-direction: column; gap: 10px; flex: 1;">
                    <div style="display: flex; gap: 10px; align-items:center;">
                        <select id="kv-mode" style="padding:8px; border-radius:4px; border:1px solid #cbd5e1; flex:1; font-weight:bold; color:#1e293b;">
                            <option value="sub3">Cách 3: Tối ưu Prefix & Suffix O(N)</option>
                            <option value="sub1">Cách 1: Vét cạn O(N²)</option>
                        </select>
                        <button onclick="kv_start()" class="toggle-btn" style="background:#0284c7; color:white; flex:1;">🚀 Nạp Dữ Liệu</button>
                    </div>
                    <div style="display: flex; gap: 10px;">
                        <button onclick="kv_step()" id="btn-kv-step" class="toggle-btn" style="background:#29c702; color:white; flex:1;" disabled>⏭ Bước tiếp</button>
                        <button onclick="kv_toggle_auto()" id="btn-kv-auto" class="toggle-btn" style="background:#8b5cf6; color:white; flex:1;" disabled>▶ Tự động</button>
                    </div>
                    
                    <div style="background: #fffbeb; padding: 10px; border-radius: 8px; border: 1px dashed #f59e0b; margin-top:5px; text-align:center;">
                        <div style="font-size:0.8rem; font-weight:bold; color:#b45309; margin-bottom:5px;">BẢNG TÍNH GCD HIỆN TẠI</div>
                        <div id="kv-calc-box" style="font-family:monospace; font-size:1.2rem; color:#92400e; font-weight:bold;">-</div>
                    </div>
                </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                <div style="background: white; border: 1px solid #e2e8f0; border-radius: 8px; padding: 15px; overflow-x:auto;">
                    <div style="font-size:0.8rem; font-weight:bold; color:#1e293b; margin-bottom:10px;">BẢNG MẢNG</div>
                    <div id="kv-arrays-container" style="display: flex; flex-direction: column; gap: 5px;"></div>
                </div>

                <div style="display: flex; flex-direction: column; gap: 10px;">
                    <div style="background: #f0fdf4; padding: 15px; border-radius: 8px; border: 2px solid #22c55e; text-align: center;">
                        <div style="font-size:0.85rem; font-weight:bold; color:#166534; margin-bottom: 5px;">MAX KHU VỰC TÌM ĐƯỢC</div>
                        <div id="kv-res-max" style="color:#15803d; font-size: 2.8rem; font-weight: 900; line-height: 1;">0</div>
                    </div>
                    
                    <div style="background: #f8fafc; padding: 10px; border-radius: 8px; border: 1px solid #cbd5e1; flex: 1; display:flex; flex-direction:column;">
                        <div style="font-size:0.8rem; font-weight:bold; color:#475569; margin-bottom:5px;">NHẬT KÝ (LOG)</div>
                        <div id="kv-log" style="font-family: monospace; font-size: 0.85rem; color: #334155; overflow-y: auto; height: 120px; line-height: 1.6; background:white; padding:8px; border:1px solid #e2e8f0;"></div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function kv_log(msg, highlight = false) {
    const log = document.getElementById('kv-log');
    let fw = highlight ? "font-weight:bold; color:#0284c7;" : "";
    log.innerHTML += `<div style="border-bottom: 1px solid #e2e8f0; padding: 4px 0; ${fw}">${msg}</div>`;
    log.scrollTop = log.scrollHeight;
}

function gcd(a, b) {
    if (a === 0) return b;
    if (b === 0) return a;
    while (b !== 0) {
        let temp = b;
        b = a % b;
        a = temp;
    }
    return a;
}

function kv_start() {
    const lines = document.getElementById('kv-input').value.trim().split('\n');
    clearInterval(window.kv_auto_timer);
    document.getElementById('btn-kv-auto').innerHTML = "▶ Tự động";
    window.kv_auto_timer = null;
    window.kv_mode = document.getElementById('kv-mode').value;

    try {
        window.kv_N = parseInt(lines[0].trim());
        window.kv_A = lines[1].trim().split(/\s+/).map(Number);
        
        if (window.kv_A.length !== window.kv_N) throw new Error();
        if (window.kv_N > 15) {
            alert("Để mô phỏng trực quan dễ nhìn, vui lòng nhập mảng N <= 15."); return;
        }
    } catch(e) {
        alert("Lỗi đọc dữ liệu. Dòng 1: N. Dòng 2: Mảng A."); return;
    }

    document.getElementById('kv-res-max').innerText = "0";
    document.getElementById('kv-log').innerHTML = "";
    document.getElementById('kv-calc-box').innerHTML = "-";
    
    document.getElementById('btn-kv-step').disabled = false;
    document.getElementById('btn-kv-auto').disabled = false;
    
    if (window.kv_mode === 'sub1') window.kv_generator = logic_kv_brute();
    else window.kv_generator = logic_kv_opt();
    
    // Initial Render
    kv_render_arrays(-1, -1, -1);
    kv_log(`Đã nạp mảng ${window.kv_N} thẻ. Chọn ${window.kv_mode === 'sub1' ? 'Vét cạn' : 'Prefix/Suffix O(N)'}.`, true);
}

function kv_render_arrays(excludedIdx, prefIdx = -1, suffIdx = -1, currentJ = -1) {
    const container = document.getElementById('kv-arrays-container');
    let html = `<table style="border-collapse: collapse; text-align: center; font-family: monospace; font-size: 1rem;">`;
    
    // Row 1: Index
    html += `<tr><td style="padding: 4px; font-weight:bold; color:#94a3b8; border:1px solid #cbd5e1; font-size:0.8rem;">i</td>`;
    html += `<td style="padding: 4px; border:1px solid #cbd5e1; color:#cbd5e1; font-size:0.8rem;">0</td>`; // Rào
    for(let i=0; i<window.kv_N; i++) html += `<td style="padding: 4px; border:1px solid #cbd5e1; color:#94a3b8; font-size:0.8rem;">${i+1}</td>`;
    html += `<td style="padding: 4px; border:1px solid #cbd5e1; color:#cbd5e1; font-size:0.8rem;">${window.kv_N+1}</td>`; // Rào
    html += `</tr>`;

    // Row Pref (Only Sub3)
    if (window.kv_mode === 'sub3') {
        html += `<tr><td style="padding: 6px; font-weight:bold; color:#15803d; border:1px solid #cbd5e1; background:#f0fdf4;">Pref</td>`;
        html += `<td style="padding: 6px; border:1px solid #cbd5e1; background:#f8fafc; color:#94a3b8;">0</td>`;
        for(let i=0; i<window.kv_N; i++) {
            let val = window.kv_Pref[i] !== undefined ? window.kv_Pref[i] : "";
            let bg = i === prefIdx ? "#bbf7d0" : "white";
            let border = i === prefIdx ? "2px solid #22c55e" : "1px solid #cbd5e1";
            let scale = i === prefIdx ? "transform:scale(1.1); font-weight:bold; color:#166534;" : "";
            html += `<td style="padding: 6px; border:${border}; background:${bg}; transition:0.3s; ${scale}">${val}</td>`;
        }
        html += `<td style="padding: 6px; border:1px solid #cbd5e1; background:#f8fafc; color:#94a3b8;">-</td></tr>`;
    }

    // Row A
    html += `<tr><td style="padding: 6px; font-weight:bold; color:#0f172a; border:1px solid #cbd5e1; background:#f1f5f9;">Mảng A</td>`;
    html += `<td style="padding: 6px; border:1px solid #cbd5e1; background:#f8fafc; color:#94a3b8;">-</td>`;
    for(let i=0; i<window.kv_N; i++) {
        let val = window.kv_A[i];
        let bg = "white", color = "#1e293b", border = "1px solid #cbd5e1", textDecoration = "none";
        
        if (i === excludedIdx) {
            bg = "#fee2e2"; color = "#ef4444"; border = "2px dashed #ef4444"; textDecoration = "line-through";
        } else if (i === currentJ) {
            bg = "#fef08a"; border = "2px solid #eab308"; color = "#a16207"; // Đang duyệt (Brute)
        }

        html += `<td style="padding: 6px; border:${border}; background:${bg}; color:${color}; text-decoration:${textDecoration}; transition:0.3s;">${val}</td>`;
    }
    html += `<td style="padding: 6px; border:1px solid #cbd5e1; background:#f8fafc; color:#94a3b8;">-</td></tr>`;

    // Row Suff (Only Sub3)
    if (window.kv_mode === 'sub3') {
        html += `<tr><td style="padding: 6px; font-weight:bold; color:#0369a1; border:1px solid #cbd5e1; background:#e0f2fe;">Suff</td>`;
        html += `<td style="padding: 6px; border:1px solid #cbd5e1; background:#f8fafc; color:#94a3b8;">-</td>`;
        for(let i=0; i<window.kv_N; i++) {
            let val = window.kv_Suff[i] !== undefined ? window.kv_Suff[i] : "";
            let bg = i === suffIdx ? "#bae6fd" : "white";
            let border = i === suffIdx ? "2px solid #0284c7" : "1px solid #cbd5e1";
            let scale = i === suffIdx ? "transform:scale(1.1); font-weight:bold; color:#0369a1;" : "";
            html += `<td style="padding: 6px; border:${border}; background:${bg}; transition:0.3s; ${scale}">${val}</td>`;
        }
        html += `<td style="padding: 6px; border:1px solid #cbd5e1; background:#f8fafc; color:#94a3b8;">0</td></tr>`;
    }

    html += `</table>`;
    container.innerHTML = html;
}

function* logic_kv_brute() {
    let N = window.kv_N;
    let maxGcd = 0;
    
    for (let i = 0; i < N; i++) {
        kv_log(`\n--- THỬ LOẠI BỎ THẺ A[${i+1}] = ${window.kv_A[i]} ---`, true);
        kv_render_arrays(i, -1, -1, -1);
        yield;
        
        let currentGcd = 0;
        for (let j = 0; j < N; j++) {
            if (j === i) continue;
            
            let oldGcd = currentGcd;
            currentGcd = gcd(currentGcd, window.kv_A[j]);
            
            kv_render_arrays(i, -1, -1, j);
            document.getElementById('kv-calc-box').innerHTML = `GCD(${oldGcd}, A[${j+1}]) = GCD(${oldGcd}, ${window.kv_A[j]}) = <span style="color:#0284c7;">${currentGcd}</span>`;
            kv_log(`+ Gộp A[${j+1}] = ${window.kv_A[j]} -> GCD hiện tại = ${currentGcd}`);
            yield;
        }
        
        if (currentGcd > maxGcd) {
            maxGcd = currentGcd;
            document.getElementById('kv-res-max').innerText = maxGcd;
            kv_log(`=> Kỷ lục mới: Khu vực ${maxGcd} lớn nhất!`, true);
        } else {
            kv_log(`=> GCD = ${currentGcd}. Không lớn hơn kỷ lục hiện tại (${maxGcd}).`);
        }
        yield;
    }

    kv_render_arrays(-1, -1, -1, -1);
    kv_log(`\nHOÀN THÀNH VÉT CẠN! KẾT QUẢ: ${maxGcd}`, true);
    finish_kv();
}

function* logic_kv_opt() {
    let N = window.kv_N;
    window.kv_Pref = Array(N).fill(undefined);
    window.kv_Suff = Array(N).fill(undefined);
    
    kv_log(`\n--- BƯỚC 1: XÂY MẢNG PREF (TRÁI -> PHẢI) ---`, true);
    window.kv_Pref[0] = window.kv_A[0];
    kv_render_arrays(-1, 0, -1, -1);
    yield;
    for (let i = 1; i < N; i++) {
        window.kv_Pref[i] = gcd(window.kv_Pref[i-1], window.kv_A[i]);
        kv_render_arrays(-1, i, -1, -1);
        yield;
    }

    kv_log(`\n--- BƯỚC 2: XÂY MẢNG SUFF (PHẢI -> TRÁI) ---`, true);
    window.kv_Suff[N-1] = window.kv_A[N-1];
    kv_render_arrays(-1, -1, N-1, -1);
    yield;
    for (let i = N - 2; i >= 0; i--) {
        window.kv_Suff[i] = gcd(window.kv_Suff[i+1], window.kv_A[i]);
        kv_render_arrays(-1, -1, i, -1);
        yield;
    }

    kv_log(`\n--- BƯỚC 3: DUYỆT TÌM O(N) ---`, true);
    let maxGcd = 0;
    
    for (let i = 0; i < N; i++) {
        let pVal = i === 0 ? 0 : window.kv_Pref[i-1];
        let sVal = i === N-1 ? 0 : window.kv_Suff[i+1];
        let currentGcd = gcd(pVal, sVal);
        
        kv_render_arrays(i, i-1, i+1, -1);
        document.getElementById('kv-calc-box').innerHTML = `Bỏ A[${i+1}] => GCD(Pref[${i}], Suff[${i+2}])<br>GCD(${pVal}, ${sVal}) = <span style="color:#15803d; font-size:1.5rem;">${currentGcd}</span>`;
        
        kv_log(`Loại bỏ A[${i+1}]=${window.kv_A[i]} => Ghép nửa Trái (Pref) và Phải (Suff).`);
        kv_log(`GCD(${pVal}, ${sVal}) = <b>${currentGcd}</b>`);
        
        if (currentGcd > maxGcd) {
            maxGcd = currentGcd;
            document.getElementById('kv-res-max').innerText = maxGcd;
            kv_log(`=> Kỷ lục mới: Khu vực ${maxGcd} lớn nhất!`, true);
        }
        yield;
    }

    kv_render_arrays(-1, -1, -1, -1);
    kv_log(`\nHOÀN THÀNH TỐI ƯU TOÁN HỌC! KẾT QUẢ: ${maxGcd}`, true);
    finish_kv();
}

function finish_kv() {
    document.getElementById('btn-kv-step').disabled = true;
    document.getElementById('btn-kv-auto').disabled = true;
    kv_toggle_auto(true);
}

function kv_step() {
    if (window.kv_generator) window.kv_generator.next();
}

function kv_toggle_auto(forceStop = false) {
    const btn = document.getElementById('btn-kv-auto');
    if (window.kv_auto_timer || forceStop) {
        clearInterval(window.kv_auto_timer);
        window.kv_auto_timer = null;
        if (!forceStop) btn.innerHTML = "▶ Tự động";
    } else {
        btn.innerHTML = "⏸ Tạm dừng";
        window.kv_auto_timer = setInterval(() => {
            if(window.kv_generator) {
                let res = window.kv_generator.next();
                if(res.done) kv_toggle_auto(true);
            }
        }, window.kv_mode === 'sub1' ? 400 : 1000); 
    }
}