/**
 * FILE MÔ PHỎNG: LẬP BẢNG (NSQUARE - HCM 14-15)
 * Hỗ trợ 2 phương pháp: Duyệt chính phương & Phân tích TSNT
 * (Đã tối ưu Fast-forward cho vòng lặp Vét cạn)
 */

window.nsq_n = 0n;
window.nsq_mode = "tsnt";
window.nsq_generator = null;

function init_hcm1415_nsquare_simulation() {
    const container = document.getElementById('simulation-area');
    if (!container) return;

    container.innerHTML = `
        <div class="step-card border-purple">
            <div class="step-badge bg-purple">Mô phỏng Tìm số bù chính phương (NSQUARE)</div>
            
            <div style="display: flex; gap: 15px; margin-bottom: 20px; align-items: center; flex-wrap: wrap;">
                <div>N: <input type="number" id="nsq-n" value="999" min="1" max="1000000" style="width:120px; padding:5px; border-radius:4px;"></div>
                <select id="nsq-mode" onchange="nsq_switch_mode()" style="padding:5px; border-radius:4px;">
                    <option value="duyet">Cách 1: Duyệt C = i² (Tham khảo)</option>
                    <option value="tsnt" selected>Cách 2: Phân tích Thừa số NT (Tối ưu)</option>
                </select>
                <button onclick="nsq_start()" class="toggle-btn" style="background:#0284c7; color:white;">🚀 Bắt đầu</button>
                <button onclick="nsq_step()" id="btn-nsq-step" class="toggle-btn" style="background:#29c702; color:white;" disabled>⏭ Bước tiếp theo</button>
            </div>

            <div id="nsq-workspace" style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                <div id="nsq-panel-left" style="background: white; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0; text-align:center;"></div>
                <div id="nsq-panel-right" style="background: #f0fdf4; padding: 15px; border-radius: 8px; border: 1px solid #bbf7d0; text-align:center; display:flex; flex-direction:column; justify-content:center;"></div>
            </div>

            <div id="nsq-log" style="background: #1e1e1e; color: #d4d4d4; padding: 15px; border-radius: 8px; font-family: monospace; height: 160px; overflow-y: auto; font-size: 0.85rem; line-height: 1.5;">
                > Chọn phương pháp và nhấn Bắt đầu...
            </div>
        </div>
    `;
    nsq_switch_mode();
}

function nsq_switch_mode() {
    window.nsq_mode = document.getElementById('nsq-mode').value;
    const left = document.getElementById('nsq-panel-left');
    const right = document.getElementById('nsq-panel-right');
    
    if (window.nsq_mode === 'duyet') {
        left.innerHTML = `
            <div style="font-weight:bold; color:#64748b; margin-bottom:10px;">Thử các số chính phương C = i²</div>
            <div style="font-size:1.2rem; margin-top:10px;">Đang thử: i = <b id="ui-i" style="color:#0284c7;">-</b></div>
            <div style="font-size:1.2rem; margin-top:10px;">C = i² = <b id="ui-c" style="color:#ea580c;">-</b></div>
        `;
        right.innerHTML = `
            <div style="font-weight:bold; color:#166534; margin-bottom:10px;">Phép chia kiểm tra</div>
            <div style="font-size:1.5rem; margin-top:10px; font-family:monospace;">C % A == 0 ?</div>
            <div id="ui-check" style="font-size:1.2rem; margin-top:10px; font-weight:bold;">-</div>
            <div id="ui-res-k" style="font-size:2rem; margin-top:15px; color:#15803d; font-weight:900;">B = ?</div>
        `;
    } else {
        left.innerHTML = `
            <div style="font-weight:bold; color:#64748b; margin-bottom:10px;">Phân tích N ra Thừa Số Nguyên Tố</div>
            <div id="ui-n-val" style="font-size:1.2rem; margin-bottom:15px;">-</div>
            <div id="ui-factors" style="display:flex; justify-content:center; gap:5px; flex-wrap:wrap;"></div>
        `;
        right.innerHTML = `
            <div style="font-weight:bold; color:#166534; margin-bottom:10px;">Kết quả B (K) bù chính phương</div>
            <div id="ui-k-val" style="font-size:3rem; font-weight:900; color:#15803d;">1</div>
            <div id="ui-k-expr" style="font-size:1rem; color:#065f46; margin-top:10px; font-family:monospace;">B = 1</div>
        `;
    }
}

function nsq_log(msg, color = "#d4d4d4") {
    const logArea = document.getElementById('nsq-log');
    logArea.innerHTML += `<div style="color: ${color}">> ${msg}</div>`;
    logArea.scrollTop = logArea.scrollHeight;
}

function nsq_start() {
    let val = document.getElementById('nsq-n').value;
    if (!val || val <= 0) return;
    window.nsq_n = BigInt(val);
    
    document.getElementById('nsq-log').innerHTML = "";
    document.getElementById('btn-nsq-step').disabled = false;
    
    nsq_switch_mode();
    
    if (window.nsq_mode === 'duyet') {
        window.nsq_generator = logic_duyet();
        nsq_log(`[Cách 1] Bắt đầu duyệt tìm C = i² chia hết cho A = ${window.nsq_n}`, "#38bdf8");
    } else {
        window.nsq_generator = logic_tsnt();
        nsq_log(`[Cách 2] Bắt đầu phân tích TSNT cho N = ${window.nsq_n}`, "#38bdf8");
    }
    nsq_step(); // Chạy bước đầu
}

// ============================================
// CÁCH 1: VÉT CẠN (Đã sửa lỗi Fast-forward)
// ============================================
function* logic_duyet() {
    let A = window.nsq_n;
    let max_steps = 100000n; // Giới hạn chống treo trình duyệt
    
    nsq_log(`Đang chạy ngầm lướt qua các số để tìm i phù hợp...`, "#38bdf8");
    
    for (let i = 1n; i <= A; i++) {
        let C = i * i;
        let rem = C % A;
        
        // CHỈ DỪNG MÀN HÌNH VÀ HIỂN THỊ KHI TÌM THẤY ĐÁP ÁN (rem == 0)
        if (rem === 0n) {
            document.getElementById('ui-i').innerText = i.toString();
            document.getElementById('ui-c').innerText = C.toString();
            document.getElementById('ui-check').innerText = `${C} % ${A} = 0`;
            document.getElementById('ui-check').style.color = "#10b981";
            
            let B = C / A;
            document.getElementById('ui-res-k').innerText = `B = ${B}`;
            
            nsq_log(`TÌM THẤY! Thử i = ${i} -> C = ${i}² = ${C}`, "#10b981");
            nsq_log(`Vì ${C} chia hết cho ${A}, suy ra B (K) = ${B}`, "#10b981");
            yield; 
            break;
        }
        
        // BẢO VỆ TRÌNH DUYỆT KHỎI TLE
        if (i > max_steps) {
            document.getElementById('ui-i').innerText = i.toString();
            document.getElementById('ui-check').innerText = "VƯỢT THỜI GIAN";
            document.getElementById('ui-check').style.color = "#ef4444";
            nsq_log(`Đã quét đến i = ${i} nhưng vẫn chưa thấy.`, "#ef4444");
            nsq_log(`Mô phỏng tự động dừng để bảo vệ trình duyệt (Lỗi TLE!).`, "#ef4444");
            yield;
            break;
        }
        // Lưu ý: Không có lệnh yield() ở đây, giúp vòng lặp chạy vèo qua hàng trăm bước sai!
    }
    
    nsq_log("HOÀN THÀNH CÁCH 1!", "#fbbf24");
    document.getElementById('btn-nsq-step').disabled = true;
}

// ============================================
// CÁCH 2: PHÂN TÍCH THỪA SỐ NGUYÊN TỐ
// ============================================
function* logic_tsnt() {
    let N = window.nsq_n;
    let K = 1n;
    let k_expr = "1";
    let factors = [];
    
    document.getElementById('ui-n-val').innerText = `N đang xét: ${N}`;
    
    const updateFactorsUI = () => {
        let html = factors.map(f => {
            let isOdd = f.count % 2 !== 0;
            return `<div style="background:${isOdd ? '#fee2e2' : '#f1f5f9'}; border:1px solid ${isOdd ? '#ef4444' : '#cbd5e1'}; padding:2px 6px; border-radius:4px;">
                        ${f.prime}<sup>${f.count}</sup>
                    </div>`;
        }).join('<div style="align-self:center;">×</div>');
        document.getElementById('ui-factors').innerHTML = html;
    };

    for (let i = 2n; i * i <= N; i++) {
        if (N % i === 0n) {
            let count = 0;
            while (N % i === 0n) {
                count++;
                N /= i;
            }
            factors.push({prime: i, count: count});
            updateFactorsUI();
            document.getElementById('ui-n-val').innerText = `N còn lại: ${N}`;
            
            if (count % 2 !== 0) {
                K *= i;
                k_expr += ` × ${i}`;
                document.getElementById('ui-k-val').innerText = K.toString();
                document.getElementById('ui-k-expr').innerText = `B = ${k_expr}`;
                nsq_log(`Thừa số ${i} có số mũ lẻ (${count}) -> Nhân B thêm ${i}. B = ${K}`, "#10b981");
            } else {
                nsq_log(`Thừa số ${i} có số mũ chẵn (${count}) -> Bỏ qua.`, "#94a3b8");
            }
            yield;
        }
    }

    if (N > 1n) {
        factors.push({prime: N, count: 1});
        updateFactorsUI();
        document.getElementById('ui-n-val').innerText = `N còn lại: 1`;
        K *= N;
        k_expr += ` × ${N}`;
        document.getElementById('ui-k-val').innerText = K.toString();
        document.getElementById('ui-k-expr').innerText = `B = ${k_expr}`;
        nsq_log(`N còn lại là ${N} (Mũ lẻ 1) -> Nhân B thêm ${N}.`, "#10b981");
        yield;
    }

    nsq_log(`HOÀN THÀNH! Số B (K) cần tìm là: ${K}`, "#fbbf24");
    document.getElementById('btn-nsq-step').disabled = true;
}

function nsq_step() {
    if (window.nsq_generator) {
        window.nsq_generator.next();
    }
}