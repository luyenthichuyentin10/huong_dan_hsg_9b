/**
 * FILE MÔ PHỎNG: TÁCH DÃY SỐ (TACHSO - HCM 19-20)
 * Tác giả: Gemini
 */

window.tach_S = "";
window.tach_generator = null;
window.tach_auto_timer = null;

function init_hcm1920_tachso_simulation() {
    const container = document.getElementById('simulation-area');
    if (!container) return;

    container.innerHTML = `
        <div class="step-card border-purple">
            <div class="step-badge bg-purple">Mô phỏng: Cắt Chuỗi Tham Lam "Nhìn Xa"</div>
            
            <div style="display: flex; gap: 15px; margin-bottom: 20px; align-items: center; flex-wrap: wrap;">
                <div style="flex: 2;">
                    <label style="font-size:0.85rem; color:#64748b; font-weight:bold;">Nhập dãy số S:</label><br>
                    <input type="text" id="tach-input" value="23072007" style="width:100%; padding:8px; border-radius:4px; border:1px solid #cbd5e1; font-family:monospace; font-size:1.2rem; letter-spacing: 3px;">
                </div>
                <div style="flex: 1; display: flex; gap: 10px; margin-top: 15px;">
                    <button onclick="tach_start()" class="toggle-btn" style="background:#0284c7; color:white; flex:1;">🚀 Nạp Dữ Liệu</button>
                    <button onclick="tach_step()" id="btn-tach-step" class="toggle-btn" style="background:#29c702; color:white; flex:1;" disabled>⏭ Bước tiếp</button>
                    <button onclick="tach_toggle_auto()" id="btn-tach-auto" class="toggle-btn" style="background:#8b5cf6; color:white; flex:1;" disabled>▶ Tự động</button>
                </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                <div style="background: white; border: 1px solid #e2e8f0; border-radius: 8px; padding: 15px;">
                    <div style="font-size:0.8rem; font-weight:bold; color:#475569; margin-bottom:10px;">TRẠNG THÁI DÃY SỐ (S)</div>
                    <div id="tach-string-display" style="display: flex; gap: 4px; font-family: monospace; font-size: 1.5rem; font-weight: bold; flex-wrap: wrap;"></div>
                    
                    <div style="margin-top: 20px; padding-top: 15px; border-top: 1px dashed #cbd5e1;">
                        <div style="font-size:0.8rem; font-weight:bold; color:#0284c7; margin-bottom:5px;">KIỂM TRA CHUỖI DƯ (Look-ahead)</div>
                        <div id="tach-lookahead" style="font-family: monospace; font-size: 1.1rem; color: #1e293b; background: #f0f9ff; padding: 8px; border-radius: 4px; min-height: 40px;">-</div>
                    </div>
                </div>

                <div style="display: flex; flex-direction: column; gap: 10px;">
                    <div style="background: #fffbeb; padding: 15px; border-radius: 8px; border: 1px solid #fef3c7; text-align: center; flex: 1;">
                        <div style="font-size:0.8rem; font-weight:bold; color:#92400e; margin-bottom:10px;">CÁC SỐ ĐÃ TÁCH ĐƯỢC</div>
                        <div id="tach-res-array" style="display: flex; gap: 10px; flex-wrap: wrap; justify-content: center; min-height: 50px;"></div>
                        <div style="margin-top: 15px; font-size: 0.9rem; color: #b45309;">Số cuối cùng (Prev): <b id="tach-prev" style="font-size:1.2rem;">0</b></div>
                    </div>
                </div>
            </div>

            <div id="tach-log" style="background: #1e1e1e; color: #d4d4d4; padding: 12px; border-radius: 8px; font-family: monospace; height: 180px; overflow-y: auto; font-size: 0.85rem; line-height: 1.5;">
                > Nhập dãy số và nhấn Nạp Dữ Liệu...
            </div>
        </div>
    `;
}

function tach_log(msg, color = "#d4d4d4") {
    const log = document.getElementById('tach-log');
    log.innerHTML += `<div style="color:${color}">> ${msg}</div>`;
    log.scrollTop = log.scrollHeight;
}

function tach_start() {
    window.tach_S = document.getElementById('tach-input').value.trim();
    if (!/^\d+$/.test(window.tach_S) || window.tach_S[0] === '0') {
        alert("Dãy số không hợp lệ. Chỉ nhập số và không bắt đầu bằng 0.");
        return;
    }
    
    clearInterval(window.tach_auto_timer);
    document.getElementById('btn-tach-auto').innerHTML = "▶ Tự động";
    window.tach_auto_timer = null;

    document.getElementById('tach-res-array').innerHTML = "";
    document.getElementById('tach-prev').innerText = "0";
    document.getElementById('tach-lookahead').innerHTML = "-";
    document.getElementById('tach-log').innerHTML = "";
    
    document.getElementById('btn-tach-step').disabled = false;
    document.getElementById('btn-tach-auto').disabled = false;
    
    window.tach_generator = logic_tach();
    tach_log(`Đã nạp chuỗi S = ${window.tach_S}. Bắt đầu quá trình tách...`, "#38bdf8");
    tach_step();
}

function render_string(S, cutIdx, candIdx, candLength) {
    const container = document.getElementById('tach-string-display');
    let html = '';
    for (let i = 0; i < S.length; i++) {
        let bg = "transparent", color = "#94a3b8", border = "1px solid transparent";
        
        if (i < cutIdx) {
            bg = "#dcfce7"; color = "#15803d"; border = "1px solid #22c55e"; // Đã chốt
        } else if (i >= candIdx && i < candIdx + candLength) {
            bg = "#fef08a"; color = "#b45309"; border = "1px solid #f59e0b"; // Đang thử
        } else {
            bg = "#f1f5f9"; color = "#475569"; border = "1px solid #cbd5e1"; // Chờ
        }
        
        html += `<div style="width:30px; height:35px; display:flex; align-items:center; justify-content:center; background:${bg}; color:${color}; border:${border}; border-radius:4px; transition:all 0.2s;">${S[i]}</div>`;
    }
    container.innerHTML = html;
}

function is_greater(a, b) {
    if (a.length > b.length) return true;
    if (a.length < b.length) return false;
    return a > b;
}

function can_continue(R, val) {
    if (R.length === 0) return false;
    if (R[0] === '0') return false; // Không được có số 0 đứng đầu
    return is_greater(R, val); // Giá trị R phải > val
}

function* logic_tach() {
    let S = window.tach_S;
    let res = [];
    let prev = "0";
    let idx = 0;

    render_string(S, 0, -1, 0);

    while (idx < S.length) {
        if (S[idx] === '0') {
            tach_log(`Đầu chuỗi còn lại là '0'. Vô nghĩa. BẮT BUỘC DỪNG!`, "#ef4444");
            break;
        }

        let found_cut = false;
        let smallest_valid = null;
        let smallest_len = 0;

        tach_log(`\n--- TÌM SỐ TIẾP THEO (Phải lớn hơn ${prev}) ---`, "#c084fc");

        for (let L = 1; L <= S.length - idx; L++) {
            let cand = S.substring(idx, idx + L);
            render_string(S, idx, idx, L);
            tach_log(`Thử cắt Cand = <b>${cand}</b>`);
            yield;

            if (is_greater(cand, prev)) {
                if (smallest_valid === null) {
                    smallest_valid = cand;
                    smallest_len = L;
                }

                let R = S.substring(idx + L);
                let lookaheadHtml = `Phần dư R: <b style="color:#ef4444;">"${R}"</b><br>`;
                
                if (can_continue(R, cand)) {
                    lookaheadHtml += `-> R không bắt đầu bằng '0' và R > ${cand}. <b style="color:#10b981;">(Đường lui Sáng sủa!)</b>`;
                    document.getElementById('tach-lookahead').innerHTML = lookaheadHtml;
                    tach_log(`-> Hợp lệ. Chuỗi dư <b>"${R}"</b> đảm bảo đường lui! CẮT!`, "#10b981");
                    
                    res.push(cand);
                    prev = cand;
                    idx += L;
                    found_cut = true;
                    
                    // Cập nhật giao diện kết quả
                    document.getElementById('tach-res-array').innerHTML += `<div style="background:#3b82f6; color:white; padding:5px 12px; border-radius:6px; font-weight:bold; font-size:1.2rem;">${cand}</div>`;
                    document.getElementById('tach-prev').innerText = prev;
                    yield;
                    break;
                } else {
                    lookaheadHtml += `-> R bắt đầu bằng '0' HOẶC R ≤ ${cand}. <b style="color:#ef4444;">(Tịt đường!)</b>`;
                    document.getElementById('tach-lookahead').innerHTML = lookaheadHtml;
                    tach_log(`-> Hợp lệ, NHƯNG chuỗi dư "${R}" làm tịt đường! Nới dài thêm 1 số...`, "#f59e0b");
                    yield;
                }
            } else {
                document.getElementById('tach-lookahead').innerHTML = `Cand = ${cand} ≤ Prev (${prev}). <b style="color:#ef4444;">(Bỏ qua)</b>`;
                tach_log(`-> ${cand} ≤ ${prev}. Nới dài thêm...`);
                yield;
            }
        }

        if (!found_cut) {
            tach_log(`\nKhông có độ cắt nào giữ được đường lui. BƯỚC CUỐI CÙNG!`, "#fbbf24");
            if (smallest_valid !== null) {
                res.push(smallest_valid);
                idx += smallest_len;
                document.getElementById('tach-res-array').innerHTML += `<div style="background:#3b82f6; color:white; padding:5px 12px; border-radius:6px; font-weight:bold; font-size:1.2rem;">${smallest_valid}</div>`;
                tach_log(`-> Chốt số nhỏ nhất hợp lệ: <b>${smallest_valid}</b>`, "#10b981");
            }
            render_string(S, idx, -1, 0);
            yield;
            break;
        }
    }

    render_string(S, S.length, -1, 0);
    document.getElementById('tach-lookahead').innerHTML = "-";
    tach_log(`\nHOÀN THÀNH! Tách được tối đa ${res.length} số.`, "#22c55e");
    
    document.getElementById('btn-tach-step').disabled = true;
    document.getElementById('btn-tach-auto').disabled = true;
    tach_toggle_auto(true);
}

function tach_step() {
    if (window.tach_generator) window.tach_generator.next();
}

function tach_toggle_auto(forceStop = false) {
    const btn = document.getElementById('btn-tach-auto');
    if (window.tach_auto_timer || forceStop) {
        clearInterval(window.tach_auto_timer);
        window.tach_auto_timer = null;
        if (!forceStop) btn.innerHTML = "▶ Tự động";
    } else {
        btn.innerHTML = "⏸ Tạm dừng";
        window.tach_auto_timer = setInterval(() => {
            if(window.tach_generator) {
                let res = window.tach_generator.next();
                if(res.done) tach_toggle_auto(true);
            }
        }, 0); // Tốc độ đọc log Look-ahead
    }
}