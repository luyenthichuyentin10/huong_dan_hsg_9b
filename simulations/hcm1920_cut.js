/**
 * FILE MÔ PHỎNG: CẮT DÂY (CUT - HCM 19-20)
 * Tác giả: Gemini
 */

window.cut_N = 0n;
window.cut_generator = null;
window.cut_auto_timer = null;

function init_hcm1920_cut_simulation() {
    const container = document.getElementById('simulation-area');
    if (!container) return;

    container.innerHTML = `
        <div class="step-card border-purple">
            <div class="step-badge bg-purple">Mô phỏng: Giải mã Bất đẳng thức Tam giác (Toán học O(1))</div>
            
            <div style="display: flex; gap: 15px; margin-bottom: 20px; align-items: center; flex-wrap: wrap;">
                <div>
                    <label style="font-size:0.85rem; color:#64748b; font-weight:bold;">Nhập độ dài dây N (Đến 10^18):</label><br>
                    <input type="text" id="cut-input" value="19" style="width:200px; padding:8px; border-radius:4px; border:1px solid #cbd5e1; font-family:monospace; font-size:1.1rem;">
                </div>
                <div style="display: flex; gap: 10px; margin-top: 20px; flex: 1;">
                    <button onclick="cut_random()" class="toggle-btn" style="background:#64748b; color:white;">🎲 Random Test Lớn</button>
                    <button onclick="cut_start()" class="toggle-btn" style="background:#0284c7; color:white; flex:1;">🚀 Bắt đầu Giải</button>
                    <button onclick="cut_step()" id="btn-cut-step" class="toggle-btn" style="background:#29c702; color:white; flex:1;" disabled>⏭ Phân tích bước</button>
                    <button onclick="cut_toggle_auto()" id="btn-cut-auto" class="toggle-btn" style="background:#8b5cf6; color:white; flex:1;" disabled>▶ Tự động</button>
                </div>
            </div>

            <div style="display: grid; grid-template-columns: 1.2fr 1fr; gap: 20px; margin-bottom: 20px;">
                <div style="background: white; border: 1px solid #e2e8f0; border-radius: 8px; padding: 15px;">
                    <div style="font-size:0.8rem; font-weight:bold; color:#475569; margin-bottom:10px;">TIẾN TRÌNH GIẢI TOÁN (TÌM x)</div>
                    
                    <div id="cut-step-1" style="opacity: 0.3; margin-bottom: 10px; padding: 10px; background: #f8fafc; border-radius: 6px; transition: 0.3s;">
                        <b style="color:#0284c7;">1. Gọi ẩn:</b><br>
                        Cạnh bên = <b style="color:#3b82f6;">x</b>, Cạnh đáy = <b style="color:#ef4444;">y</b><br>
                        Chu vi: <span style="font-family:monospace;">2x + y = <span id="lbl-N-1">N</span></span> $\\rightarrow$ <span style="font-family:monospace;">y = <span id="lbl-N-2">N</span> - 2x</span>
                    </div>

                    <div id="cut-step-2" style="opacity: 0.3; margin-bottom: 10px; padding: 10px; background: #f8fafc; border-radius: 6px; transition: 0.3s;">
                        <b style="color:#0284c7;">2. BĐT Tam giác (Tổng 2 cạnh > Cạnh còn lại):</b><br>
                        <span style="font-family:monospace;">x + x > y $\\Rightarrow$ 2x > <span id="lbl-N-3">N</span> - 2x $\\Rightarrow$ 4x > <span id="lbl-N-4">N</span></span><br>
                        $\\Rightarrow$ <b style="color:#10b981;">x > N / 4</b> <span id="lbl-L-calc" style="color:#15803d; font-weight:bold;"></span>
                    </div>

                    <div id="cut-step-3" style="opacity: 0.3; margin-bottom: 10px; padding: 10px; background: #f8fafc; border-radius: 6px; transition: 0.3s;">
                        <b style="color:#0284c7;">3. Đáy > Cạnh bên (Theo đề bài):</b><br>
                        <span style="font-family:monospace;">y > x $\\Rightarrow$ <span id="lbl-N-5">N</span> - 2x > x $\\Rightarrow$ 3x < <span id="lbl-N-6">N</span></span><br>
                        $\\Rightarrow$ <b style="color:#10b981;">x < N / 3</b> <span id="lbl-R-calc" style="color:#15803d; font-weight:bold;"></span>
                    </div>
                    
                    <div id="cut-step-4" style="opacity: 0.3; padding: 10px; background: #fef08a; border-radius: 6px; border: 1px solid #f59e0b; transition: 0.3s; text-align: center; font-size: 1.1rem;">
                        Khoảng nghiệm nguyên của x:<br>
                        <b style="color:#b45309;">L (<span id="lbl-L">-</span>) &le; x &le; R (<span id="lbl-R">-</span>)</b>
                    </div>
                </div>

                <div style="display: flex; flex-direction: column; gap: 10px;">
                    <div style="background: #f0fdf4; padding: 15px; border-radius: 8px; border: 2px solid #22c55e; text-align: center;">
                        <div style="font-size:0.9rem; font-weight:bold; color:#166534; margin-bottom: 5px;">SỐ CÁCH CẮT HỢP LỆ</div>
                        <div id="cut-res-total" style="color:#15803d; font-size: 3rem; font-weight: 900; line-height: 1;">0</div>
                    </div>
                    
                    <div style="background: #fffbeb; padding: 15px; border-radius: 8px; border: 1px solid #fde047; flex: 1; display:flex; flex-direction:column;">
                        <div style="font-size:0.85rem; font-weight:bold; color:#92400e; margin-bottom: 10px;">DANH SÁCH MỘT VÀI ĐÁP ÁN</div>
                        <div id="cut-examples" style="font-family: monospace; font-size: 1rem; color: #b45309; line-height: 1.6; overflow-y:auto; max-height:120px;">
                            (Chưa có)
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function cut_random() {
    let numStr = "";
    const length = Math.floor(Math.random() * 15) + 3; // 3 to 17 digits
    numStr += (Math.floor(Math.random() * 9) + 1).toString();
    for (let i = 1; i < length; i++) {
        numStr += Math.floor(Math.random() * 10).toString();
    }
    document.getElementById('cut-input').value = numStr;
    cut_start();
}

function cut_start() {
    try {
        let val = document.getElementById('cut-input').value.trim();
        if (val === "") throw new Error();
        window.cut_N = BigInt(val);
        if (window.cut_N <= 0n) throw new Error();
    } catch(e) {
        alert("N không hợp lệ. Phải là số nguyên lớn hơn 0.");
        return;
    }

    clearInterval(window.cut_auto_timer);
    document.getElementById('btn-cut-auto').innerHTML = "▶ Tự động";
    window.cut_auto_timer = null;

    // Reset UI
    [1, 2, 3, 4].forEach(i => {
        document.getElementById(`cut-step-${i}`).style.opacity = '0.3';
    });
    document.getElementById('cut-res-total').innerText = "0";
    document.getElementById('cut-examples').innerHTML = "(Đang tính toán...)";
    
    // Set variables in text
    let nStr = window.cut_N.toString();
    [1,2,3,4,5,6].forEach(i => document.getElementById(`lbl-N-${i}`).innerText = nStr);
    document.getElementById('lbl-L-calc').innerText = "";
    document.getElementById('lbl-R-calc').innerText = "";
    document.getElementById('lbl-L').innerText = "-";
    document.getElementById('lbl-R').innerText = "-";

    document.getElementById('btn-cut-step').disabled = false;
    document.getElementById('btn-cut-auto').disabled = false;
    
    window.cut_generator = logic_cut();
    cut_step();
}

function* logic_cut() {
    let N = window.cut_N;

    // Step 1: Base equations
    document.getElementById('cut-step-1').style.opacity = '1';
    yield;

    // Step 2: L calculation
    document.getElementById('cut-step-2').style.opacity = '1';
    let L = N / 4n + 1n;
    document.getElementById('lbl-L-calc').innerText = `=> Cận dưới L = ${L}`;
    yield;

    // Step 3: R calculation
    document.getElementById('cut-step-3').style.opacity = '1';
    let R = (N - 1n) / 3n;
    document.getElementById('lbl-R-calc').innerText = `=> Cận trên R = ${R}`;
    yield;

    // Step 4: Range & Result
    document.getElementById('cut-step-4').style.opacity = '1';
    document.getElementById('lbl-L').innerText = L.toString();
    document.getElementById('lbl-R').innerText = R.toString();
    
    let ans = R - L + 1n;
    if (ans < 0n) ans = 0n;
    
    document.getElementById('cut-res-total').innerText = ans.toString();

    // Show examples
    let examplesHtml = "";
    if (ans === 0n) {
        examplesHtml = "<i style='color:#ef4444;'>Không có cách cắt nào thỏa mãn! Dây quá ngắn hoặc không chia được tỷ lệ.</i>";
    } else {
        let count = 0;
        for (let x = L; x <= R && count < 5; x++) {
            let y = N - 2n * x;
            examplesHtml += `&bull; x = ${x} &rarr; Cạnh: (<b>${x}</b>, <b>${x}</b>, <b>${y}</b>)<br>`;
            count++;
        }
        if (ans > 5n) {
            examplesHtml += `<i>... và ${ans - 5n} cách khác.</i>`;
        }
    }
    document.getElementById('cut-examples').innerHTML = examplesHtml;
    
    document.getElementById('btn-cut-step').disabled = true;
    document.getElementById('btn-cut-auto').disabled = true;
    cut_toggle_auto(true);
}

function cut_step() {
    if (window.cut_generator) window.cut_generator.next();
}

function cut_toggle_auto(forceStop = false) {
    const btn = document.getElementById('btn-cut-auto');
    if (window.cut_auto_timer || forceStop) {
        clearInterval(window.cut_auto_timer);
        window.cut_auto_timer = null;
        if (!forceStop) btn.innerHTML = "▶ Tự động";
    } else {
        btn.innerHTML = "⏸ Tạm dừng";
        window.cut_auto_timer = setInterval(() => {
            if(window.cut_generator) {
                let res = window.cut_generator.next();
                if(res.done) cut_toggle_auto(true);
            }
        }, 0); 
    }
}