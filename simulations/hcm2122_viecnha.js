/**
 * FILE MÔ PHỎNG: LÀM VIỆC NHÀ (VIECNHA - HCM 21-22)
 * Tác giả: Gemini
 */

window.viec_T = 0;
window.viec_C = 0;
window.viec_A = [];
window.viec_generator = null;
window.viec_auto_timer = null;

function init_hcm2122_viecnha_simulation() {
    const container = document.getElementById('simulation-area');
    if (!container) return;

    container.innerHTML = `
        <div class="step-card border-purple">
            <div class="step-badge bg-purple">Mô phỏng: Tham lam Ưu tiên việc nhỏ (Greedy)</div>
            
            <div style="display: flex; gap: 15px; margin-bottom: 20px; align-items: flex-start; flex-wrap: wrap;">
                <div>
                    <textarea id="viec-input" style="width: 150px; height: 180px; padding: 5px; font-family: monospace; font-size: 1rem;" placeholder="Nhập T&#10;Nhập C&#10;C dòng tiếp theo...">6
3
3
6
3</textarea>
                </div>
                <div style="display: flex; flex-direction: column; gap: 10px; flex: 1;">
                    <div style="display: flex; gap: 10px;">
                        <button onclick="viec_random()" class="toggle-btn" style="background:#64748b; color:white; flex:1;">🎲 Random Test</button>
                        <button onclick="viec_start()" class="toggle-btn" style="background:#0284c7; color:white; flex:1;">🚀 Nạp Dữ Liệu</button>
                    </div>
                    <div style="display: flex; gap: 10px;">
                        <button onclick="viec_step()" id="btn-viec-step" class="toggle-btn" style="background:#29c702; color:white; flex:1;" disabled>⏭ Bước tiếp</button>
                        <button onclick="viec_toggle_auto()" id="btn-viec-auto" class="toggle-btn" style="background:#8b5cf6; color:white; flex:1;" disabled>▶ Tự động</button>
                    </div>
                    
                    <div style="background: #f8fafc; padding: 15px; border-radius: 8px; border: 1px solid #cbd5e1; margin-top:5px;">
                        <div style="display:flex; justify-content:space-between; margin-bottom:8px; font-weight:bold; color:#1e293b;">
                            <span>ĐÃ DÙNG: <span id="viec-used-time" style="color:#0284c7;">0</span></span>
                            <span>QUỸ THỜI GIAN (T): <span id="viec-total-time" style="color:#ef4444;">0</span></span>
                        </div>
                        <div style="width: 100%; height: 25px; background: #e2e8f0; border-radius: 12px; overflow: hidden; border: 1px solid #94a3b8; position: relative;">
                            <div id="viec-progress" style="height: 100%; width: 0%; background: #3b82f6; transition: width 0.4s ease-in-out;"></div>
                            <div id="viec-progress-fail" style="height: 100%; width: 0%; background: #ef4444; opacity: 0.5; position: absolute; top:0; right:0; transition: width 0.4s ease-in-out;"></div>
                        </div>
                    </div>
                </div>
            </div>

            <div style="display: grid; grid-template-columns: 1.5fr 1fr; gap: 20px; margin-bottom: 20px;">
                <div style="background: white; border: 1px solid #e2e8f0; border-radius: 8px; padding: 15px;">
                    <div style="font-size:0.85rem; font-weight:bold; color:#475569; margin-bottom:10px;">DANH SÁCH CÔNG VIỆC (Mảng A)</div>
                    <div id="viec-array" style="display: flex; flex-wrap: wrap; gap: 8px;"></div>
                </div>

                <div style="display: flex; flex-direction: column; gap: 10px;">
                    <div style="background: #f0fdf4; padding: 15px; border-radius: 8px; border: 2px solid #22c55e; text-align: center; flex: 1; display:flex; flex-direction:column; justify-content:center;">
                        <div style="font-size:0.9rem; font-weight:bold; color:#166534; margin-bottom: 5px;">SỐ VIỆC LÀM ĐƯỢC</div>
                        <div id="viec-res-count" style="color:#15803d; font-size: 3.5rem; font-weight: 900; line-height: 1;">0</div>
                    </div>
                </div>
            </div>

            <div id="viec-log" style="background: #1e1e1e; color: #d4d4d4; padding: 12px; border-radius: 8px; font-family: monospace; height: 160px; overflow-y: auto; font-size: 0.85rem; line-height: 1.5;">
                > Nhập dữ liệu và nhấn Nạp...
            </div>
        </div>
    `;
}

function viec_log(msg, color = "#d4d4d4") {
    const log = document.getElementById('viec-log');
    log.innerHTML += `<div style="color:${color}">> ${msg}</div>`;
    log.scrollTop = log.scrollHeight;
}

function viec_random() {
    const T = Math.floor(Math.random() * 50) + 20; // 20 to 70
    const C = Math.floor(Math.random() * 10) + 5;  // 5 to 14
    let text = `${T}\n${C}\n`;
    for(let i=0; i<C; i++){
        text += (Math.floor(Math.random() * 15) + 1) + "\n";
    }
    document.getElementById('viec-input').value = text.trim();
    viec_start();
}

function viec_start() {
    const lines = document.getElementById('viec-input').value.trim().split('\n');
    if (lines.length < 2) return;
    
    clearInterval(window.viec_auto_timer);
    document.getElementById('btn-viec-auto').innerHTML = "▶ Tự động";
    window.viec_auto_timer = null;

    try {
        window.viec_T = parseInt(lines[0].trim());
        window.viec_C = parseInt(lines[1].trim());
        window.viec_A = [];
        
        // Đọc dữ liệu, bỏ qua các dòng trống
        let lineIdx = 2;
        while (window.viec_A.length < window.viec_C && lineIdx < lines.length) {
            let val = lines[lineIdx].trim();
            if (val !== "") window.viec_A.push(parseInt(val));
            lineIdx++;
        }
    } catch(e) {
        alert("Lỗi định dạng. Dòng 1: T, Dòng 2: C, Các dòng sau: Thời gian."); return;
    }

    // Reset UI
    document.getElementById('viec-total-time').innerText = window.viec_T;
    document.getElementById('viec-used-time').innerText = "0";
    document.getElementById('viec-progress').style.width = "0%";
    document.getElementById('viec-progress-fail').style.width = "0%";
    document.getElementById('viec-res-count').innerText = "0";
    document.getElementById('viec-log').innerHTML = "";
    
    document.getElementById('btn-viec-step').disabled = false;
    document.getElementById('btn-viec-auto').disabled = false;
    
    viec_render_array(-1, "unsorted");
    window.viec_generator = logic_viec();
    viec_log(`Đã nạp quỹ thời gian T = ${window.viec_T} và ${window.viec_C} công việc.`, "#38bdf8");
}

function viec_render_array(activeIdx, state) {
    const container = document.getElementById('viec-array');
    let html = '';
    
    window.viec_A.forEach((time, i) => {
        let bg = "#f1f5f9", color = "#475569", border = "1px solid #cbd5e1";
        let transform = "";
        
        if (state === "sorted" || state === "running") {
            bg = "#e0f2fe"; color = "#0284c7"; border = "1px solid #7dd3fc";
        }
        
        if (state === "running") {
            if (i < activeIdx) {
                bg = "#dcfce7"; color = "#15803d"; border = "2px solid #22c55e"; // Done
            } else if (i === activeIdx) {
                bg = "#fef08a"; color = "#b45309"; border = "2px solid #f59e0b"; // Current
                transform = "transform: scale(1.1);";
            }
        }
        
        if (state === "failed" && i === activeIdx) {
            bg = "#fee2e2"; color = "#b91c1c"; border = "2px solid #ef4444"; // Failed
            transform = "transform: scale(1.1);";
        } else if (state === "failed" && i > activeIdx) {
            bg = "#f3f4f6"; color = "#9ca3af"; border = "1px dashed #d1d5db"; // Ignored
        }

        html += `<div style="padding: 6px 12px; border-radius: 4px; background: ${bg}; color: ${color}; border: ${border}; transition: all 0.3s; ${transform} font-weight:bold;">${time}</div>`;
    });
    
    container.innerHTML = html;
}

function update_progress(used, failAmount = 0) {
    let percent = (used / window.viec_T) * 100;
    if (percent > 100) percent = 100;
    document.getElementById('viec-progress').style.width = `${percent}%`;
    document.getElementById('viec-used-time').innerText = used;

    if (failAmount > 0) {
        let failPercent = (failAmount / window.viec_T) * 100;
        document.getElementById('viec-progress-fail').style.width = `${failPercent}%`;
    }
}

function* logic_viec() {
    viec_log(`\n--- BƯỚC 1: SẮP XẾP MẢNG TĂNG DẦN ---`, "#c084fc");
    yield;
    
    window.viec_A.sort((a, b) => a - b);
    viec_render_array(-1, "sorted");
    viec_log(`Đã sắp xếp! Ưu tiên làm các việc tốn ít thời gian nhất trước.`, "#10b981");
    yield;

    viec_log(`\n--- BƯỚC 2: CỘNG DỒN THAM LAM ---`, "#c084fc");
    let current_sum = 0;
    let count = 0;

    for (let i = 0; i < window.viec_C; i++) {
        let chore_time = window.viec_A[i];
        viec_render_array(i, "running");
        viec_log(`\nXét việc tốn <b>${chore_time}</b> thời gian.`);
        yield;

        if (current_sum + chore_time <= window.viec_T) {
            current_sum += chore_time;
            count++;
            
            update_progress(current_sum);
            document.getElementById('viec-res-count').innerText = count;
            
            viec_log(`-> Hợp lệ (${current_sum} ≤ ${window.viec_T}). Đã nhận làm <b>${count}</b> việc!`, "#10b981");
            yield;
        } else {
            let overflow = (current_sum + chore_time) - window.viec_T;
            update_progress(current_sum, overflow);
            viec_render_array(i, "failed");
            
            viec_log(`-> QUÁ GIỜ! Nếu nhận sẽ mất ${current_sum + chore_time} > ${window.viec_T}.`, "#ef4444");
            viec_log(`=> Dừng lại ngay! Các việc sau cũng sẽ quá giờ.`, "#fbbf24");
            yield;
            break;
        }
    }

    viec_log(`\nHOÀN THÀNH! Số lượng việc tối đa làm được là: ${count}`, "#22c55e");
    
    document.getElementById('btn-viec-step').disabled = true;
    document.getElementById('btn-viec-auto').disabled = true;
    viec_toggle_auto(true);
}

function viec_step() {
    if (window.viec_generator) window.viec_generator.next();
}

function viec_toggle_auto(forceStop = false) {
    const btn = document.getElementById('btn-viec-auto');
    if (window.viec_auto_timer || forceStop) {
        clearInterval(window.viec_auto_timer);
        window.viec_auto_timer = null;
        if (!forceStop) btn.innerHTML = "▶ Tự động";
    } else {
        btn.innerHTML = "⏸ Tạm dừng";
        window.viec_auto_timer = setInterval(() => {
            if(window.viec_generator) {
                let res = window.viec_generator.next();
                if(res.done) viec_toggle_auto(true);
            }
        }, 1000); 
    }
}