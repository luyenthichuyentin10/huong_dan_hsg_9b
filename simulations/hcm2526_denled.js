/**
 * FILE MÔ PHỎNG: HỆ THỐNG ĐÈN LED (Đề Tham Khảo)
 * Tác giả: Gemini
 */

window.dl_N = 0;
window.dl_K = 0;
window.dl_A = [];
window.dl_DP = []; // Array of length K
window.dl_mode = 'sub4';
window.dl_generator = null;
window.dl_auto_timer = null;

function init_hcm2526_denled_simulation() {
    const container = document.getElementById('simulation-area');
    if (!container) return;

    container.innerHTML = `
        <div class="step-card border-purple">
            <div class="step-badge bg-purple">Mô phỏng: Quy hoạch động theo Số dư (DP Modulo)</div>
            
            <div style="display: flex; gap: 15px; margin-bottom: 20px; align-items: flex-start; flex-wrap: wrap;">
                <div>
                    <textarea id="dl-input" style="width: 150px; height: 100px; padding: 5px; font-family: monospace; font-size: 1.1rem; text-align:center;" placeholder="N K&#10;Mảng A...">3 6
10 2 4</textarea>
                </div>
                <div style="display: flex; flex-direction: column; gap: 10px; flex: 1;">
                    <div style="display: flex; gap: 10px; align-items:center;">
                        <select id="dl-mode" style="padding:8px; border-radius:4px; border:1px solid #cbd5e1; flex:1; font-weight:bold; color:#1e293b;">
                            <option value="sub4">Cách 4: DP Số dư (K tùy ý) O(N*K)</option>
                            <option value="sub2">Cách 2: Tính chất Toán học (K = 2)</option>
                        </select>
                        <button onclick="dl_start()" class="toggle-btn" style="background:#0284c7; color:white; flex:1;">🚀 Nạp Dữ Liệu</button>
                    </div>
                    <div style="display: flex; gap: 10px;">
                        <button onclick="dl_step()" id="btn-dl-step" class="toggle-btn" style="background:#29c702; color:white; flex:1;" disabled>⏭ Bước tiếp</button>
                        <button onclick="dl_toggle_auto()" id="btn-dl-auto" class="toggle-btn" style="background:#8b5cf6; color:white; flex:1;" disabled>▶ Tự động</button>
                    </div>
                    
                    <div style="display: flex; justify-content: space-between; align-items: stretch; gap: 10px; margin-top:5px;">
                        <div style="background: #fffbeb; padding: 10px; border-radius: 8px; border: 1px dashed #f59e0b; flex:1; display:flex; flex-direction:column; justify-content:center;">
                            <div style="font-size:0.8rem; font-weight:bold; color:#b45309; margin-bottom:5px; text-align:center;">ĐÈN ĐANG XÉT</div>
                            <div id="dl-active-item" style="font-family:monospace; font-size:2rem; color:#92400e; font-weight:bold; text-align:center;">-</div>
                        </div>
                        <div style="background: #f0fdf4; padding: 10px; border-radius: 8px; border: 2px solid #22c55e; flex:1; text-align: center; display:flex; flex-direction:column; justify-content:center;">
                            <div style="font-size:0.85rem; font-weight:bold; color:#166534; margin-bottom: 5px;">KẾT QUẢ ĐẠT ĐƯỢC DP[0]</div>
                            <div id="dl-res-max" style="color:#15803d; font-size: 2.2rem; font-weight: 900; line-height: 1;">0</div>
                        </div>
                    </div>
                </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr; gap: 20px; margin-bottom: 20px;">
                <div style="background: white; border: 1px solid #e2e8f0; border-radius: 8px; padding: 15px; overflow-x:auto;" id="dl-dp-panel">
                    <div style="font-size:0.8rem; font-weight:bold; color:#1e293b; margin-bottom:10px;">MẢNG TRẠNG THÁI: DP[SỐ DƯ] = TỔNG LỚN NHẤT</div>
                    <div id="dl-dp-container" style="display: flex; gap: 8px; flex-wrap:wrap;"></div>
                </div>

                <div style="background: #f8fafc; padding: 10px; border-radius: 8px; border: 1px solid #cbd5e1; display:flex; flex-direction:column;">
                    <div style="font-size:0.8rem; font-weight:bold; color:#475569; margin-bottom:5px;">NHẬT KÝ (LOG)</div>
                    <div id="dl-log" style="font-family: monospace; font-size: 0.85rem; color: #334155; overflow-y: auto; height: 160px; line-height: 1.6; background:white; padding:8px; border:1px solid #e2e8f0;"></div>
                </div>
            </div>
        </div>
    `;
}

function dl_log(msg, highlight = false) {
    const log = document.getElementById('dl-log');
    let fw = highlight ? "font-weight:bold; color:#0284c7;" : "";
    log.innerHTML += `<div style="border-bottom: 1px solid #e2e8f0; padding: 4px 0; ${fw}">${msg}</div>`;
    log.scrollTop = log.scrollHeight;
}

function dl_start() {
    const lines = document.getElementById('dl-input').value.trim().split('\n');
    clearInterval(window.dl_auto_timer);
    document.getElementById('btn-dl-auto').innerHTML = "▶ Tự động";
    window.dl_auto_timer = null;
    window.dl_mode = document.getElementById('dl-mode').value;

    try {
        const [N, K] = lines[0].trim().split(/\s+/).map(Number);
        window.dl_N = N;
        window.dl_K = K;
        window.dl_A = lines[1].trim().split(/\s+/).map(Number);
        
        if (window.dl_A.length !== N) throw new Error();
        if (window.dl_mode === 'sub2' && K !== 2) {
            alert("Cách 2 (Tính chẵn lẻ) chỉ áp dụng được khi K = 2. Vui lòng sửa lại K hoặc đổi sang Cách 4.");
            return;
        }
        if (window.dl_mode === 'sub4' && K > 20) {
            alert("Để mô phỏng DP trực quan vừa màn hình, xin vui lòng nhập K <= 20.");
            return;
        }
    } catch(e) {
        alert("Lỗi dữ liệu. Dòng 1: N K. Dòng 2: Mảng A."); return;
    }

    document.getElementById('dl-res-max').innerText = "0";
    document.getElementById('dl-log').innerHTML = "";
    document.getElementById('dl-active-item').innerText = "-";
    
    document.getElementById('btn-dl-step').disabled = false;
    document.getElementById('btn-dl-auto').disabled = false;
    
    if (window.dl_mode === 'sub4') {
        document.getElementById('dl-dp-panel').style.display = "block";
        window.dl_generator = logic_dl_dp();
    } else {
        document.getElementById('dl-dp-panel').style.display = "none";
        window.dl_generator = logic_dl_k2();
    }
    
    dl_log(`Đã nạp mảng ${window.dl_N} đèn, Ngưỡng K = ${window.dl_K}.`, true);
}

function dl_render_dp(highlightTarget = -1, highlightSource = -1) {
    const container = document.getElementById('dl-dp-container');
    let html = '';
    
    for (let i = 0; i < window.dl_K; i++) {
        let val = window.dl_DP[i] === -1 ? "-∞" : window.dl_DP[i];
        let bg = "white", border = "1px solid #cbd5e1", scale = "";
        
        if (val !== "-∞") bg = "#f0fdf4"; // Có giá trị thì xanh nhạt
        if (i === highlightSource) {
            bg = "#bae6fd"; border = "2px solid #0284c7"; // Ô nguồn Xanh dương
        }
        if (i === highlightTarget) {
            bg = "#fef08a"; border = "2px solid #eab308"; scale = "transform:scale(1.1); font-weight:bold;"; // Ô đích Vàng
        }

        html += `
            <div style="display:flex; flex-direction:column; align-items:center; width:55px;">
                <div style="font-size:0.7rem; color:#64748b; font-weight:bold;">mod ${i}</div>
                <div style="width:100%; height:40px; display:flex; align-items:center; justify-content:center; background:${bg}; border:${border}; border-radius:6px; font-family:monospace; font-size:1.1rem; transition:0.3s; ${scale}">${val}</div>
            </div>
        `;
    }
    container.innerHTML = html;
}

function* logic_dl_dp() {
    let K = window.dl_K;
    window.dl_DP = Array(K).fill(-1);
    window.dl_DP[0] = 0; // Trạng thái khởi tạo
    
    dl_render_dp();
    dl_log(`Khởi tạo: DP[0] = 0. Chưa chọn đèn nào, tổng 0, số dư 0.`);
    yield;

    for (let i = 0; i < window.dl_N; i++) {
        let val = window.dl_A[i];
        document.getElementById('dl-active-item').innerHTML = `A[${i+1}] = <span style="color:#0284c7;">${val}</span>`;
        dl_log(`\n--- XÉT ĐÈN THỨ ${i+1}: CÔNG SUẤT ${val} ---`, true);
        
        let next_DP = [...window.dl_DP]; // Copy mảng
        let updated = false;

        for (let r = 0; r < K; r++) {
            if (window.dl_DP[r] !== -1) {
                let new_mod = (r + val) % K;
                let new_sum = window.dl_DP[r] + val;
                
                dl_render_dp(new_mod, r);
                dl_log(`Từ DP[${r}] = ${window.dl_DP[r]} &rarr; Cộng thêm ${val}. Tổng mới = ${new_sum}. Số dư = ${new_sum} % ${K} = <b>${new_mod}</b>.`);
                yield;
                
                if (new_sum > next_DP[new_mod]) {
                    next_DP[new_mod] = new_sum;
                    dl_log(`&rarr; <span style="color:#166534;">Cập nhật DP[${new_mod}] thành ${new_sum}</span> (Lớn hơn giá trị cũ).`);
                } else {
                    dl_log(`&rarr; <span style="color:#ef4444;">Bỏ qua</span> vì ${new_sum} không lớn hơn giá trị hiện tại của DP[${new_mod}] là ${next_DP[new_mod]}.`);
                }
                updated = true;
                yield;
            }
        }
        
        window.dl_DP = [...next_DP];
        dl_render_dp();
        document.getElementById('dl-res-max').innerText = window.dl_DP[0] === -1 ? 0 : window.dl_DP[0];
        dl_log(`Hoàn tất xét đèn ${i+1}.`);
        yield;
    }

    document.getElementById('dl-active-item').innerHTML = "-";
    let ans = window.dl_DP[0] > 0 ? window.dl_DP[0] : 0;
    dl_log(`\n=> KẾT THÚC! Tổng đạt chuẩn (Dư 0) lớn nhất là: ${ans}`, true);
    finish_dl();
}

function* logic_dl_k2() {
    dl_log(`\n--- PHÂN TÍCH CHẴN LẺ (K = 2) ---`, true);
    
    let sum = 0;
    let min_odd = Infinity;
    
    for (let i = 0; i < window.dl_N; i++) {
        let val = window.dl_A[i];
        sum += val;
        
        document.getElementById('dl-active-item').innerHTML = `A[${i+1}] = <span style="color:#0284c7;">${val}</span>`;
        if (val % 2 !== 0) {
            dl_log(`+ Cộng ${val}. (ĐÂY LÀ SỐ LẺ)`);
            if (val < min_odd) {
                min_odd = val;
                dl_log(`  &rarr; Cập nhật số lẻ nhỏ nhất = ${min_odd}`);
            }
        } else {
            dl_log(`+ Cộng ${val}.`);
        }
        document.getElementById('dl-res-max').innerText = sum;
        yield;
    }
    
    dl_log(`\nTổng tất cả = ${sum}`, true);
    if (sum % 2 === 0) {
        dl_log(`Tổng hiện tại đang CHẴN. Không cần loại bỏ ai!`);
    } else {
        dl_log(`Tổng hiện tại đang LẺ. Phải hi sinh 1 số lẻ nhỏ nhất là <b>${min_odd}</b> để trở thành chẵn.`);
        yield;
        sum -= min_odd;
        document.getElementById('dl-res-max').innerText = sum;
        dl_log(`=> Tổng chẵn lớn nhất = ${sum}`);
    }
    
    dl_log(`\n=> KẾT THÚC!`, true);
    document.getElementById('dl-active-item').innerHTML = "-";
    finish_dl();
}

function finish_dl() {
    document.getElementById('btn-dl-step').disabled = true;
    document.getElementById('btn-dl-auto').disabled = true;
    dl_toggle_auto(true);
}

function dl_step() {
    if (window.dl_generator) window.dl_generator.next();
}

function dl_toggle_auto(forceStop = false) {
    const btn = document.getElementById('btn-dl-auto');
    if (window.dl_auto_timer || forceStop) {
        clearInterval(window.dl_auto_timer);
        window.dl_auto_timer = null;
        if (!forceStop) btn.innerHTML = "▶ Tự động";
    } else {
        btn.innerHTML = "⏸ Tạm dừng";
        window.dl_auto_timer = setInterval(() => {
            if(window.dl_generator) {
                let res = window.dl_generator.next();
                if(res.done) dl_toggle_auto(true);
            }
        }, window.dl_mode === 'sub4' ? 0 : 0); 
    }
}