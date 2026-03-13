/**
 * FILE MÔ PHỎNG: VAY VÀ TRẢ (ZDIST - HCM 17-18)
 * Cập nhật: DP Duyệt ngược (Reverse Traversal) + Mảng lưu vết (Parent_w)
 */

window.zdist_N = 0;
window.zdist_arr = [];
window.zdist_generator = null;
window.zdist_auto_timer = null;

function init_hcm1718_zdist_simulation() {
    const container = document.getElementById('simulation-area');
    if (!container) return;

    container.innerHTML = `
        <div class="step-card border-purple">
            <div class="step-badge bg-purple">Mô phỏng: Greedy & DP Duyệt Ngược (ZDIST)</div>
            
            <div style="display: flex; gap: 15px; margin-bottom: 20px; align-items: flex-start; flex-wrap: wrap;">
                <div>
                    <textarea id="zdist-input" style="width: 150px; height: 200px; padding: 5px; font-family: monospace;" placeholder="Nhập N và mảng D...">10
-100
-200
-300
-400
-500
-600
-700
-800
-900
1000</textarea>
                </div>
                <div style="display: flex; flex-direction: column; gap: 10px; flex: 1;">
                    <div style="display: flex; gap: 10px;">
                        <button onclick="zdist_start()" class="toggle-btn" style="background:#0284c7; color:white; flex:1;">🚀 Nạp Dữ Liệu</button>
                    </div>
                    <div style="display: flex; gap: 10px;">
                        <button onclick="zdist_step()" id="btn-zdist-step" class="toggle-btn" style="background:#29c702; color:white; flex:1;" disabled>⏭ Bước tiếp</button>
                        <button onclick="zdist_toggle_auto()" id="btn-zdist-auto" class="toggle-btn" style="background:#8b5cf6; color:white; flex:1;" disabled>▶ Tự động</button>
                    </div>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 5px;">
                        <div style="background: #f0fdf4; padding: 10px; border-radius: 8px; border: 1px solid #bbf7d0; text-align: center;">
                            <div style="font-size:0.8rem; font-weight:bold; color:#166534;">TIỀN MẶT ĐANG CÓ (CASH)</div>
                            <div id="zdist-cash" style="color:#15803d; font-size: 1.5rem; font-weight: 900;">0</div>
                        </div>
                        <div style="background: #fffbeb; padding: 10px; border-radius: 8px; border: 1px solid #fef3c7; text-align: center; max-height: 100px; overflow-y: auto;">
                            <div style="font-size:0.8rem; font-weight:bold; color:#92400e; margin-bottom:5px;">SỔ NỢ (TỔNG: <span id="zdist-total-debt">0</span>)</div>
                            <div id="zdist-stack" style="font-family:monospace; font-size: 0.85rem; color:#ea580c;">[Trống]</div>
                        </div>
                    </div>

                    <div id="zdist-dp-container" style="display: none; background: #fdf2f8; border: 1px solid #fbcfe8; border-radius: 8px; padding: 10px; margin-top: 5px;">
                        <div style="font-size:0.8rem; font-weight:bold; color:#be185d; margin-bottom:8px;">MẢNG DP (CẬP NHẬT DUYỆT NGƯỢC)</div>
                        <div id="zdist-dp-states" style="display: flex; gap: 8px; flex-wrap: wrap; max-height: 120px; overflow-y: auto;"></div>
                    </div>
                </div>
            </div>

            <div style="background: white; border: 1px solid #e2e8f0; border-radius: 8px; padding: 15px; margin-bottom: 20px; overflow-x: auto;">
                <div id="zdist-path" style="display: flex; align-items: center; min-width: max-content; padding-bottom: 10px;"></div>
            </div>

            <div style="display: grid; grid-template-columns: 1.5fr 1fr; gap: 20px;">
                <div id="zdist-log" style="background: #1e1e1e; color: #d4d4d4; padding: 12px; border-radius: 8px; font-family: monospace; height: 180px; overflow-y: auto; font-size: 0.85rem; line-height: 1.5;">
                    > Nhập dữ liệu và nhấn Nạp...
                </div>
                
                <div style="background: #eff6ff; padding: 15px; border-radius: 8px; border: 1px solid #bfdbfe; text-align: center; display: flex; flex-direction: column; justify-content: center;">
                    <div style="font-size:0.85rem; font-weight:bold; color:#1e40af; margin-bottom: 10px;">TỔNG QUÃNG ĐƯỜNG</div>
                    <div style="font-size: 1rem; color: #475569;">Cơ bản (N) = <span id="zdist-res-base" style="font-weight:bold;">0</span></div>
                    <div style="font-size: 1rem; color: #c084fc; margin-bottom: 5px;">+ Phát sinh = <span id="zdist-res-extra" style="font-weight:bold;">0</span></div>
                    <div style="width: 60%; height: 2px; background: #cbd5e1; margin: 0 auto 5px auto;"></div>
                    <div id="zdist-res-total" style="color:#1d4ed8; font-size: 3rem; font-weight: 900;">0</div>
                </div>
            </div>
        </div>
    `;
}

function zdist_log(msg, color = "#d4d4d4") {
    const log = document.getElementById('zdist-log');
    log.innerHTML += `<div style="color:${color}">> ${msg}</div>`;
    log.scrollTop = log.scrollHeight;
}

function zdist_start() {
    const lines = document.getElementById('zdist-input').value.trim().split('\n');
    if (lines.length < 2) return;
    
    clearInterval(window.zdist_auto_timer);
    document.getElementById('btn-zdist-auto').innerHTML = "▶ Tự động";
    window.zdist_auto_timer = null;

    try {
        window.zdist_N = parseInt(lines[0].trim());
        window.zdist_arr = [];
        for (let i = 1; i <= window.zdist_N; i++) {
            if (lines[i]) window.zdist_arr.push(parseInt(lines[i].trim()));
        }
    } catch(e) {
        alert("Lỗi đọc dữ liệu."); return;
    }

    document.getElementById('zdist-cash').innerText = "0";
    document.getElementById('zdist-total-debt').innerText = "0";
    document.getElementById('zdist-stack').innerHTML = "[Trống]";
    document.getElementById('zdist-res-base').innerText = window.zdist_N;
    document.getElementById('zdist-res-extra').innerText = "0";
    document.getElementById('zdist-res-total').innerText = "0";
    document.getElementById('zdist-log').innerHTML = "";
    document.getElementById('zdist-dp-container').style.display = 'none';
    
    document.getElementById('btn-zdist-step').disabled = false;
    document.getElementById('btn-zdist-auto').disabled = false;
    
    zdist_render_path(-1);
    window.zdist_generator = logic_zdist();
    zdist_log(`Bắt đầu hành trình ${window.zdist_N} chặng...`, "#38bdf8");
}

function zdist_render_path(activeIdx, edgeStatus = []) {
    let html = '';
    html += `<div style="display:flex; flex-direction:column; align-items:center;">
                <div style="font-size:0.7rem; color:#64748b; margin-bottom:2px;">Pos 0</div>
                <div style="width:30px; height:30px; border-radius:50%; background:#94a3b8; color:white; display:flex; align-items:center; justify-content:center; font-weight:bold; font-size:0.8rem;">🏁</div>
             </div>`;

    for(let i = 0; i < window.zdist_N; i++) {
        let eColor = "#e2e8f0"; 
        if (edgeStatus[i] === 'debt') eColor = "#f97316"; 
        else if (edgeStatus[i] === 'paid') eColor = "#c084fc"; 
        else if (edgeStatus[i] === 'dp_paid') eColor = "#ec4899"; 
        
        html += `<div style="width: 35px; height: 2px; background: ${eColor}; margin: 0 5px; position:relative; top:10px; transition: all 0.3s;"></div>`;

        let val = window.zdist_arr[i];
        let nColor = val >= 0 ? "#10b981" : "#ef4444";
        let bg = i === activeIdx ? "#fef08a" : "white";
        let border = i === activeIdx ? "2px solid #f59e0b" : `2px solid ${nColor}`;
        let scale = i === activeIdx ? "transform: scale(1.15);" : "";
        
        if (edgeStatus[i] === 'paid') {
            bg = "#f3e8ff"; border = "2px solid #c084fc"; nColor = "#9333ea";
        } else if (edgeStatus[i] === 'dp_paid') {
            bg = "#fce7f3"; border = "2px solid #ec4899"; nColor = "#db2777";
        }

        html += `<div style="display:flex; flex-direction:column; align-items:center;">
                    <div style="font-size:0.7rem; color:#64748b; margin-bottom:2px;">Pos ${i+1}</div>
                    <div style="min-width:40px; height:40px; border-radius:8px; background:${bg}; color:${nColor}; display:flex; align-items:center; justify-content:center; font-weight:bold; font-family:monospace; border:${border}; transition:all 0.2s; ${scale}">
                        ${val > 0 ? '+' : ''}${val}
                    </div>
                 </div>`;
    }
    document.getElementById('zdist-path').innerHTML = html;
}

function update_debt_ui(debts, total_debt) {
    document.getElementById('zdist-total-debt').innerText = total_debt;
    if (debts.length === 0) {
        document.getElementById('zdist-stack').innerHTML = "[Trống]";
        return;
    }
    let html = debts.map(s => `<div>Pos ${s.idx + 1}: Nợ ${s.amt}</div>`).join('');
    document.getElementById('zdist-stack').innerHTML = html;
}

function render_dp_ui(dp, cash, highlight_w = -1) {
    let html = '';
    for (let w = 0; w <= cash; w++) {
        if (dp[w] !== Infinity) {
            let bg = (w === highlight_w) ? '#fbcfe8' : '#f8fafc';
            let border = (w === highlight_w) ? '#ec4899' : '#cbd5e1';
            let scale = (w === highlight_w) ? 'transform: scale(1.05); box-shadow: 0 2px 4px rgba(0,0,0,0.1);' : '';
            html += `
                <div style="background:${bg}; border:1px solid ${border}; padding:4px 8px; border-radius:4px; font-size:0.75rem; text-align:center; transition: all 0.2s; ${scale}">
                    <b style="color:#be185d;">Mức $${w}</b><br><span style="color:#475569;">Lùi ${dp[w]} bước</span>
                </div>
            `;
        }
    }
    document.getElementById('zdist-dp-states').innerHTML = html;
}

function* logic_zdist() {
    let N = window.zdist_N;
    let cash = 0;
    let total_debt = 0;
    let debts = [];
    let extra_dist = 0;
    let nodeStatus = Array(N).fill('normal');
    
    // ============================================
    // GIAI ĐOẠN 1: QUÉT TRÊN ĐƯỜNG ĐI (GREEDY)
    // ============================================
    for (let i = 0; i < N; i++) {
        let val = window.zdist_arr[i];
        zdist_render_path(i, nodeStatus);
        
        zdist_log(`------------------`, "#475569");
        zdist_log(`Đến vị trí ${i+1}. Giao dịch: ${val > 0 ? '+'+val : val}`);

        if (val < 0) {
            let debt = -val;
            if (cash > 0) {
                let pay = Math.min(cash, debt);
                cash -= pay;
                debt -= pay;
                zdist_log(`-> Có tiền, trả ngay tại chỗ ${pay}. Cash còn: ${cash}`, "#f59e0b");
            }
            if (debt > 0) {
                debts.push({idx: i, amt: debt});
                total_debt += debt;
                nodeStatus[i] = 'debt';
                zdist_log(`-> Thiếu tiền. Ghi vào sổ nợ ${debt}. Tổng nợ: ${total_debt}`, "#ef4444");
            }
        } 
        else if (val > 0) {
            cash += val;
            zdist_log(`-> Nhận tiền! Cash hiện tại: ${cash}`, "#10b981");
            
            if (cash >= total_debt && total_debt > 0) {
                zdist_log(`=> ĐÃ ĐỦ TIỀN THANH TOÁN TOÀN BỘ SỔ NỢ!`, "#10b981");
                cash -= total_debt;
                let furthest = debts[0].idx;
                let extra = 2 * (i - furthest);
                extra_dist += extra;
                
                for(let d of debts) nodeStatus[d.idx] = 'paid';
                zdist_log(`=> Quay lùi quét sạch nợ đến Pos ${furthest + 1}. Phát sinh: ${extra} bước.`, "#c084fc");
                
                debts = [];
                total_debt = 0;
            }
        }
        
        document.getElementById('zdist-cash').innerText = cash;
        update_debt_ui(debts, total_debt);
        document.getElementById('zdist-res-extra').innerText = extra_dist;
        document.getElementById('zdist-res-total').innerText = N + extra_dist;
        zdist_render_path(i, nodeStatus);
        
        yield; 
    }

    // ============================================
    // GIAI ĐOẠN 2: KNAPSACK DP TẠI ĐÍCH (DUYỆT NGƯỢC)
    // ============================================
    if (total_debt > 0 && cash > 0) {
        zdist_log(`\n--- PHÂN TÍCH CUỐI CHẶNG ---`, "#c084fc");
        zdist_log(`Cash = ${cash}, Nợ = ${total_debt}. KHÔNG ĐỦ TRẢ HẾT!`, "#ef4444");
        zdist_log(`Bắt đầu chạy DP Duyệt ngược để tìm tổ hợp lùi ít bước nhất...`, "#db2777");
        
        document.getElementById('zdist-dp-container').style.display = 'block';
        
        let dp = Array(cash + 1).fill(Infinity);
        let parent_w = Array(cash + 1).fill(-1); // Lưu vết mức tiền trước đó
        let selected_k = Array(cash + 1).fill(-1); // Lưu vết người đã trả
        dp[0] = 0;
        
        render_dp_ui(dp, cash, 0);
        yield;

        // DUYỆT NGƯỢC TỪ CUỐI LÊN
        for (let k = debts.length - 1; k >= 0; k--) {
            let d = debts[k];
            let dist = N - 1 - d.idx; // Khoảng cách tăng dần
            zdist_log(`Xét ngược: Nợ Pos ${d.idx + 1} (${d.amt} đồng). Cách đích ${dist} bước.`, "#8b5cf6");
            
            let updated = false;
            for (let w = cash; w >= d.amt; w--) {
                // CHỈ TẠO Ô MỚI KHI NÓ CHƯA AI CHIẾM (dp[w] == Infinity)
                if (dp[w - d.amt] !== Infinity && dp[w] === Infinity) {
                    dp[w] = dist; // Ghi thẳng, không cần MIN/MAX
                    parent_w[w] = w - d.amt;
                    selected_k[w] = k;
                    
                    zdist_log(` -> TẠO MỚI DP! Trả được mức $${w}, chỉ lùi ${dist} bước.`, "#ec4899");
                    render_dp_ui(dp, cash, w);
                    updated = true;
                    yield; 
                }
            }
            if (!updated) {
                zdist_log(` -> Không ghép thêm được mức nào mới.`, "#94a3b8");
                yield;
            }
        }
        
        // Truy vết kết quả
        let best_w = 0;
        for (let w = cash; w >= 0; w--) {
            if (dp[w] !== Infinity) { best_w = w; break; }
        }
        
        if (best_w > 0) {
            let extra = 2 * dp[best_w];
            extra_dist += extra;
            
            let curr_w = best_w;
            let chosen_str = [];
            
            // Dùng mảng lưu vết để tìm ngược lại các khoản nợ đã trả
            while (curr_w > 0) {
                let k = selected_k[curr_w];
                let d = debts[k];
                nodeStatus[d.idx] = 'dp_paid';
                chosen_str.unshift(`Pos ${d.idx + 1} (${d.amt})`); // Thêm vào đầu để in ra xuôi chiều
                curr_w = parent_w[curr_w];
            }
            
            cash -= best_w;
            render_dp_ui(dp, cash, best_w); 
            zdist_log(`\n=> KẾT LUẬN DP: Chọn trả ${chosen_str.join(' và ')}. Tổng trả: ${best_w}.`, "#ec4899");
            zdist_log(`=> Quãng đường quay lui xa nhất: ${dp[best_w]} bước. Phát sinh: ${extra} bước.`, "#ec4899");
        }
        
        document.getElementById('zdist-cash').innerText = cash;
        document.getElementById('zdist-res-extra').innerText = extra_dist;
        document.getElementById('zdist-res-total').innerText = N + extra_dist;
        zdist_render_path(N-1, nodeStatus);
    } 
    else if (total_debt > 0 && cash === 0) {
        zdist_log(`\nĐã về đích. Rỗng túi. Xù nợ toàn bộ ${total_debt}!`, "#ef4444");
    }

    zdist_log(`\nHOÀN THÀNH! Tổng quãng đường: Cơ bản (${N}) + Phát sinh (${extra_dist}) = ${N + extra_dist}`, "#fbbf24");
    
    document.getElementById('btn-zdist-step').disabled = true;
    document.getElementById('btn-zdist-auto').disabled = true;
    zdist_toggle_auto(true);
}

function zdist_step() {
    if (window.zdist_generator) window.zdist_generator.next();
}

function zdist_toggle_auto(forceStop = false) {
    const btn = document.getElementById('btn-zdist-auto');
    if (window.zdist_auto_timer || forceStop) {
        clearInterval(window.zdist_auto_timer);
        window.zdist_auto_timer = null;
        if (!forceStop) btn.innerHTML = "▶ Tự động";
    } else {
        btn.innerHTML = "⏸ Tạm dừng";
        window.zdist_auto_timer = setInterval(() => {
            if(window.zdist_generator) {
                let res = window.zdist_generator.next();
                if(res.done) zdist_toggle_auto(true);
            }
        }, 800);
    }
}