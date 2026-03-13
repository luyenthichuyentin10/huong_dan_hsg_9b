/**
 * FILE MÔ PHỎNG: XỔ SỐ (XOSO - HCM 22-23)
 * Cập nhật: Sắp xếp giảm dần theo hướng dẫn của Thầy
 */

window.xs_N = 0;
window.xs_K = 0;
window.xs_X = [];
window.xs_MOD = 1000000007n;
window.xs_mode = 'sub3';
window.xs_generator = null;
window.xs_auto_timer = null;

function init_hcm2223_xoso_simulation() {
    const container = document.getElementById('simulation-area');
    if (!container) return;

    container.innerHTML = `
        <div class="step-card border-purple">
            <div class="step-badge bg-purple">Mô phỏng: Cố định Max & Toán Tổ Hợp</div>
            
            <div style="display: flex; gap: 15px; margin-bottom: 20px; align-items: flex-start; flex-wrap: wrap;">
                <div>
                    <label style="font-size:0.85rem; color:#64748b; font-weight:bold;">Nhập N, K và Mảng:</label><br>
                    <textarea id="xs-input" style="width: 180px; height: 80px; padding: 5px; font-family: monospace; font-size: 1.1rem;" placeholder="N K&#10;Mảng...">4 2
6 7 6 5</textarea>
                </div>
                <div style="display: flex; flex-direction: column; gap: 10px; flex: 1;">
                    <div style="display: flex; gap: 10px; align-items:center;">
                        <select id="xs-mode" style="padding:8px; border-radius:4px; border:1px solid #cbd5e1; flex:1; font-weight:bold; color:#1e293b;">
                            <option value="sub3">Cách 3: Tối ưu Tổ Hợp (Sắp xếp Giảm dần + Cố định Max)</option>
                            <option value="sub2">Cách 2: Vét cạn Tổ Hợp (Chỉ dùng cho N ≤ 6)</option>
                        </select>
                        <button onclick="xs_start()" class="toggle-btn" style="background:#0284c7; color:white; flex:1;">🚀 Nạp & Chạy</button>
                    </div>
                    <div style="display: flex; gap: 10px;">
                        <button onclick="xs_step()" id="btn-xs-step" class="toggle-btn" style="background:#29c702; color:white; flex:1;" disabled>⏭ Bước tiếp</button>
                        <button onclick="xs_toggle_auto()" id="btn-xs-auto" class="toggle-btn" style="background:#8b5cf6; color:white; flex:1;" disabled>▶ Tự động</button>
                    </div>
                </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                <div style="background: white; border: 1px solid #e2e8f0; border-radius: 8px; padding: 15px;">
                    <div style="font-size:0.8rem; font-weight:bold; color:#475569; margin-bottom:10px;">TRẠNG THÁI MẢNG</div>
                    <div id="xs-array-display" style="display: flex; flex-wrap: wrap; gap: 8px; min-height: 40px; margin-bottom: 15px;"></div>
                    
                    <div style="background: #f8fafc; padding: 10px; border-radius: 8px; border: 1px dashed #cbd5e1; min-height: 60px;">
                        <div style="font-size:0.8rem; font-weight:bold; color:#0284c7; margin-bottom:5px;">CÔNG THỨC TOÁN HỌC ĐANG XÉT</div>
                        <div id="xs-math-formula" style="font-family: monospace; font-size: 1.1rem; color: #b45309;">-</div>
                    </div>
                </div>

                <div style="display: flex; flex-direction: column; gap: 10px;">
                    <div style="background: #f0fdf4; padding: 15px; border-radius: 8px; border: 1px solid #bbf7d0; text-align: center;">
                        <div style="font-size:0.85rem; font-weight:bold; color:#166534; margin-bottom: 5px;">TỔNG ĐIỂM THƯỞNG (MOD 10^9+7)</div>
                        <div id="xs-res-sum" style="color:#15803d; font-size: 2.5rem; font-weight: 900; font-family: monospace; letter-spacing: 2px;">0</div>
                    </div>
                    
                    <div style="background: #fffbeb; padding: 10px; border-radius: 8px; border: 1px solid #fef3c7; flex: 1;">
                        <div style="font-size:0.8rem; font-weight:bold; color:#92400e; margin-bottom:5px;">BẢNG LIỆT KÊ (LOG)</div>
                        <div id="xs-log" style="font-family: monospace; font-size: 0.9rem; color: #475569; height: 180px; overflow-y: auto; line-height: 1.6;"></div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function xs_log(msg, color = "#475569") {
    const log = document.getElementById('xs-log');
    log.innerHTML += `<div style="color:${color}; border-bottom: 1px solid #fde68a; padding: 3px 0;">${msg}</div>`;
    log.scrollTop = log.scrollHeight;
}

function get_combinations(arr, k) {
    let result = [];
    function backtrack(start, current_comb) {
        if (current_comb.length === k) {
            result.push([...current_comb]);
            return;
        }
        for (let i = start; i < arr.length; i++) {
            current_comb.push(arr[i]);
            backtrack(i + 1, current_comb);
            current_comb.pop();
        }
    }
    backtrack(0, []);
    return result;
}

function xs_C(n, k) {
    if (k < 0n || k > n) return 0n;
    if (k === 0n || k === n) return 1n;
    let res = 1n;
    for (let i = 1n; i <= k; i++) {
        res = res * (n - i + 1n) / i;
    }
    return res;
}

function xs_start() {
    const lines = document.getElementById('xs-input').value.trim().split('\n');
    if (lines.length < 2) return;
    
    clearInterval(window.xs_auto_timer);
    document.getElementById('btn-xs-auto').innerHTML = "▶ Tự động";
    window.xs_auto_timer = null;
    window.xs_mode = document.getElementById('xs-mode').value;

    try {
        const [N, K] = lines[0].trim().split(/\s+/).map(Number);
        window.xs_N = N;
        window.xs_K = K;
        window.xs_X = lines[1].trim().split(/\s+/).map(BigInt);
        
        if (window.xs_X.length !== window.xs_N) throw new Error();
        if (window.xs_mode === 'sub2' && window.xs_N > 6) {
            alert("Để chống đơ trình duyệt, Chế độ Vét cạn (Sub 2) chỉ áp dụng cho N <= 6. Vui lòng giảm N hoặc chuyển sang Sub 3.");
            return;
        }
    } catch(e) {
        alert("Lỗi đọc dữ liệu. Vui lòng nhập đúng N K và mảng."); return;
    }

    document.getElementById('xs-res-sum').innerText = "0";
    document.getElementById('xs-log').innerHTML = "";
    document.getElementById('xs-math-formula').innerHTML = "-";
    
    document.getElementById('btn-xs-step').disabled = false;
    document.getElementById('btn-xs-auto').disabled = false;
    
    if (window.xs_mode === 'sub2') {
        xs_render_array(-1, []);
        window.xs_generator = logic_xs_sub2();
    } else {
        // SẮP XẾP GIẢM DẦN (Descending Sort)
        window.xs_X.sort((a, b) => (a > b ? -1 : (a < b ? 1 : 0))); 
        xs_render_array(-1, []);
        window.xs_generator = logic_xs_sub3();
    }
    
    xs_log(`Đã nạp ${window.xs_N} phần tử. K = ${window.xs_K}`, "#38bdf8");
    if (window.xs_mode === 'sub3') xs_log(`<b>ĐÃ SẮP XẾP MẢNG GIẢM DẦN!</b>`, "#10b981");
}

function xs_render_array(maxIdx, poolIndices = []) {
    const container = document.getElementById('xs-array-display');
    let html = '';
    
    for (let i = 0; i < window.xs_N; i++) {
        let bg = "#f1f5f9", color = "#475569", border = "1px solid #cbd5e1";
        let transform = "";
        
        if (i === maxIdx) {
            bg = "#fee2e2"; color = "#b91c1c"; border = "2px solid #ef4444"; // Đỏ (Max)
            transform = "transform: scale(1.15); font-weight:900;";
        } else if (poolIndices.includes(i)) {
            bg = "#dcfce7"; color = "#15803d"; border = "2px solid #22c55e"; // Xanh (Được chọn / Hồ chứa)
            transform = "transform: scale(1.05); font-weight:bold;";
        }

        html += `<div style="padding: 8px 12px; border-radius: 6px; background: ${bg}; color: ${color}; border: ${border}; transition: all 0.3s; ${transform} font-family:monospace; font-size:1.1rem;">${window.xs_X[i]}</div>`;
    }
    
    container.innerHTML = html;
}

function* logic_xs_sub2() {
    let arr = window.xs_X.map((val, idx) => ({val, idx}));
    let combs = get_combinations(arr, window.xs_K);
    let total = 0n;

    for (let i = 0; i < combs.length; i++) {
        let comb = combs[i];
        let max_val = -1n;
        let max_idx = -1;
        let pool = [];
        
        comb.forEach(item => {
            pool.push(item.idx);
            if (item.val > max_val) {
                max_val = item.val;
                max_idx = item.idx;
            }
        });
        
        pool = pool.filter(idx => idx !== max_idx);
        
        xs_render_array(max_idx, pool);
        
        let vals_str = comb.map(c => c.val).join(', ');
        document.getElementById('xs-math-formula').innerHTML = `Cách ${i+1}: Chọn [${vals_str}] &rarr; Max = <b style="color:#ef4444;">${max_val}</b>`;
        
        total = (total + max_val) % window.xs_MOD;
        document.getElementById('xs-res-sum').innerText = total;
        
        xs_log(`Cách ${i+1}: Chọn [${vals_str}] | Thưởng: <b>${max_val}</b>`);
        yield;
    }

    xs_render_array(-1, []);
    xs_log(`\n<b>HOÀN THÀNH VÉT CẠN!</b>`, "#ea580c");
    document.getElementById('btn-xs-step').disabled = true;
    document.getElementById('btn-xs-auto').disabled = true;
    xs_toggle_auto(true);
}

function* logic_xs_sub3() {
    let N = window.xs_N;
    let K = window.xs_K;
    let total = 0n;

    // Vòng lặp từ 0 đến N - K (vì phải chừa lại ít nhất K-1 phần tử phía sau để lập tổ hợp)
    for (let i = 0; i <= N - K; i++) {
        let max_val = window.xs_X[i];
        let pool_indices = [];
        
        // Hồ chứa là tất cả các phần tử nằm bên phải của max_val
        for(let j = i + 1; j < N; j++) pool_indices.push(j); 
        
        xs_render_array(i, pool_indices);
        
        // Số phần tử trong hồ chứa = N - 1 - i
        let n_pool = BigInt(N - 1 - i);
        let k_need = BigInt(K - 1);
        let combinations = xs_C(n_pool, k_need);
        let reward = (max_val * combinations) % window.xs_MOD;
        
        document.getElementById('xs-math-formula').innerHTML = `
            Cố định <b>X[${i}] = ${max_val}</b> làm Max.<br>
            Bắt cặp với ${k_need} phần tử từ ${n_pool} ô màu xanh bên phải.<br>
            => Số cách chọn: C(${n_pool}, ${k_need}) = <b>${combinations}</b> cách.
        `;
        
        xs_log(`+ Cố định <b>${max_val}</b> làm Max. Có <b>${combinations}</b> tập hợp.`);
        xs_log(`=> Thưởng: ${max_val} × ${combinations} = <b>${reward}</b>`, "#10b981");
        
        total = (total + reward) % window.xs_MOD;
        document.getElementById('xs-res-sum').innerText = total;
        yield;
    }

    xs_render_array(-1, []);
    document.getElementById('xs-math-formula').innerHTML = "Hoàn thành quy hoạch toàn bộ mảng!";
    xs_log(`\n<b>HOÀN THÀNH TỐI ƯU TOÁN HỌC O(N)!</b>`, "#ea580c");
    
    document.getElementById('btn-xs-step').disabled = true;
    document.getElementById('btn-xs-auto').disabled = true;
    xs_toggle_auto(true);
}

function xs_step() {
    if (window.xs_generator) window.xs_generator.next();
}

function xs_toggle_auto(forceStop = false) {
    const btn = document.getElementById('btn-xs-auto');
    if (window.xs_auto_timer || forceStop) {
        clearInterval(window.xs_auto_timer);
        window.xs_auto_timer = null;
        if (!forceStop) btn.innerHTML = "▶ Tự động";
    } else {
        btn.innerHTML = "⏸ Tạm dừng";
        window.xs_auto_timer = setInterval(() => {
            if(window.xs_generator) {
                let res = window.xs_generator.next();
                if(res.done) xs_toggle_auto(true);
            }
        }, 0); 
    }
}