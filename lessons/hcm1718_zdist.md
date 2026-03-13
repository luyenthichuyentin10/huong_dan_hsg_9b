## 💵 Bài: Vay và trả (ZDIST - HCM 2017-2018)
<br>
<div class="step-card border-blue">
<div class="step-badge bg-blue">Phân tích đề bài</div>

Bờm đi qua $N$ khách hàng xếp trên một đường thẳng cách nhau 1 đơn vị. Bờm xuất phát từ vị trí 0 và kết thúc ở vị trí $N$.
- Tại mỗi vị trí $i$, nếu $D_i > 0$, Bờm nhận được tiền. Nếu $D_i < 0$, Bờm đang nợ tiền.
- Bờm luôn đi về đích. Trong quá trình đi, nếu thu đủ tiền, Bờm sẽ **quay lại** trả cho những người mình nợ.
- Nếu về đến đích mà tổng tiền không đủ để trả toàn bộ nợ, Bờm sẽ chấp nhận "xù nợ" phần còn thiếu và dừng luôn tại đích (không quay lại trả lắt nhắt).

**Yêu cầu:** Tính tổng quãng đường tối thiểu Bờm phải đi.
<div class="important-note">

**📌 Dạng bài:** Tham lam
</div>
</div>

<div class="step-card border-orange">
<div class="step-badge bg-orange">Giải pháp: Tham lam (Greedy) kết hợp Quy hoạch động (Knapsack)</div>

### 💡 Ý tưởng Tối ưu
Bài toán chia làm 2 giai đoạn rất rõ rệt:

**Giai đoạn 1: Trên đường đi (Thuật toán Tham lam - Greedy)**
- Ta quản lý lượng `Cash` (Tiền mặt) và danh sách các khoản nợ.
- Bất cứ khi nào đi ngang một người nợ (số âm), nếu trong túi đang có sẵn `Cash`, Bờm **trả ngay tại chỗ** để đỡ phải quay lại sau này. Phần nợ còn thiếu mới ghi vào sổ nợ.
- Nếu được nhận tiền, `Cash` tăng lên. Nếu `Cash` $\ge$ `Tổng_Nợ` hiện tại, Bờm sẽ quét quay lùi 1 vòng, trả sạch nợ, và xóa sổ. Quãng đường phát sinh là `2 × (Vị trí hiện tại - Vị trí nợ xa nhất)`.

**Giai đoạn 2: Tại đích đến (Thuật toán Knapsack)**
- Nếu về đích mà tổng nợ vẫn còn, ta chọn trả một tổ hợp sao cho: Tổng tiền trả là lớn nhất (tối đa bằng `Cash` đang có) và khoảng cách lùi là ngắn nhất. Ví dụ: Nợ 4500, nhưng cầm 1000). Bờm không xù nợ hết, mà tìm cách trả tối ưu nhất.
    - Kỹ thuật Duyệt ngược: Duyệt danh sách nợ từ **Người gần đích nhất** lùi về **Người xa đích nhất**. Khoảng cách lùi (`dist`) sẽ tăng dần. Do đó, khi ta ghép được mức tiền `w`, đó chắc chắn là khoảng cách nhỏ nhất. Chỉ việc gán `DP[w] = dist` (không cần MIN/MAX).
    - Kỹ thuật Cắt tỉa (Early Exit): Vì mục tiêu tối thượng là trả được số tiền lớn nhất (chính là toàn bộ `Cash`), nên ngay khoảnh khắc `DP[Cash]` được ghép thành công, ta lập tức `break` thoát toàn bộ vòng lặp! Lúc này ta đã tìm được cách tiêu sạch tiền với quãng đường lùi tối ưu nhất.
- Đây chính là bài toán **Cái túi (0-1 Knapsack)**:
  - Sức chứa của túi: `Cash`.
  - Khối lượng & Giá trị của đồ vật: Các khoản nợ.
  - Mục tiêu 1: Tổng giá trị trả được lớn nhất (từ đó nợ còn lại ít nhất).
  - Mục tiêu 2: Vị trí quay lui xa nhất là nhỏ nhất (để tiết kiệm bước đi).
- Ta dùng mảng DP `DP[w]`: *Quãng đường đi lùi xa nhất để trả được chính xác tổng nợ là $w$*.

<pre class="pseudocode">
<span class="kw">NHẬP</span> <span class="var">N</span>
<span class="var">Cash</span> = <span class="val">0</span>
<span class="var">Total_Debt</span> = <span class="val">0</span>
<span class="var">Extra_Dist</span> = <span class="val">0</span>
<span class="var">Danh_Sach_No</span> = []

<span class="com">// GIAI ĐOẠN 1: Tham lam trên đường đi</span>
<span class="kw">LẶP</span> <span class="var">i</span> từ <span class="val">1</span> <span class="kw">ĐẾN</span> <span class="var">N</span>:
    <span class="kw">NHẬP</span> <span class="var">val</span>
    <span class="kw">NẾU</span> (<span class="var">val</span> < <span class="val">0</span>) <span class="kw">THÌ</span>:
        <span class="var">debt</span> = -<span class="var">val</span>
        <span class="kw">NẾU</span> (<span class="var">Cash</span> > <span class="val">0</span>) <span class="kw">THÌ</span>:
            <span class="var">pay</span> = <span class="fn">MIN</span>(<span class="var">Cash</span>, <span class="var">debt</span>)
            <span class="var">Cash</span> = <span class="var">Cash</span> - <span class="var">pay</span>
            <span class="var">debt</span> = <span class="var">debt</span> - <span class="var">pay</span>
        <span class="kw">NẾU</span> (<span class="var">debt</span> > <span class="val">0</span>) <span class="kw">THÌ</span>:
            <span class="var">Danh_Sach_No</span>.Them({pos: <span class="var">i</span>, amt: <span class="var">debt</span>})
            <span class="var">Total_Debt</span> = <span class="var">Total_Debt</span> + <span class="var">debt</span>
            
    <span class="kw">NẾU</span> (<span class="var">val</span> > <span class="val">0</span>) <span class="kw">THÌ</span>:
        <span class="var">Cash</span> = <span class="var">Cash</span> + <span class="var">val</span>
        <span class="kw">NẾU</span> (<span class="var">Cash</span> ≥ <span class="var">Total_Debt</span> <span class="kw">VÀ</span> <span class="var">Total_Debt</span> > <span class="val">0</span>) <span class="kw">THÌ</span>:
            <span class="var">Cash</span> = <span class="var">Cash</span> - <span class="var">Total_Debt</span>
            <span class="var">furthest</span> = <span class="var">Danh_Sach_No</span>[<span class="val">0</span>].pos
            <span class="var">Extra_Dist</span> = <span class="var">Extra_Dist</span> + <span class="val">2</span> * (<span class="var">i</span> - <span class="var">furthest</span>)
            <span class="var">Danh_Sach_No</span>.Xoa_Tat_Ca()
            <span class="var">Total_Debt</span> = <span class="val">0</span>

<span class="com">// --- GIAI ĐOẠN 2: Knapsack tại đích ---</span>
<span class="kw">NẾU</span> (<span class="var">Total_Debt</span> > <span class="val">0</span> <span class="kw">VÀ</span> <span class="var">Cash</span> > <span class="val">0</span>) <span class="kw">THÌ</span>:
    <span class="var">DP</span> = <span class="fn">Mang</span>(<span class="var">Cash</span> + <span class="val">1</span>, <span class="val">Vô_Cực</span>)
    <span class="var">DP</span>[<span class="val">0</span>] = <span class="val">0</span>
    
    <span class="com">// Duyệt ngược từ cuối danh sách lên đầu</span>
    <span class="kw">LẶP</span> <span class="var">i</span> từ <span class="fn">Kich_Thuoc</span>(<span class="var">Danh_Sach_No</span>) - <span class="val">1</span> <span class="kw">GIẢM VỀ</span> <span class="val">0</span>:
        <span class="var">quang_duong</span> = <span class="var">N</span> - <span class="var">Danh_Sach_No</span>[<span class="var">i</span>].pos
        <span class="var">no</span> = <span class="var">Danh_Sach_No</span>[<span class="var">i</span>].amt
        
        <span class="com">// Lặp tiền từ Cash lùi về số nợ đang xét</span>
        <span class="kw">LẶP</span> <span class="var">w</span> từ <span class="var">Cash</span> <span class="kw">GIẢM VỀ</span> <span class="var">no</span>:
            <span class="com">// Nếu trạng thái trước hợp lệ và trạng thái hiện tại trống</span>
            <span class="kw">NẾU</span> (<span class="var">DP</span>[<span class="var">w</span> - <span class="var">no</span>] ≠ <span class="val">Vô_Cực</span> <span class="kw">VÀ</span> <span class="var">DP</span>[<span class="var">w</span>] == <span class="val">Vô_Cực</span>) <span class="kw">THÌ</span>:
                <span class="var">DP</span>[<span class="var">w</span>] = <span class="var">quang_duong</span>
                
                <span class="com">// Cắt tỉa 1: Nếu đạt mức tiền tối đa, dừng lặp w</span>
                <span class="kw">NẾU</span> (<span class="var">DP</span>[<span class="var">Cash</span>] ≠ <span class="val">Vô_Cực</span>) <span class="kw">THÌ THOÁT_LẶP</span>
                
        <span class="com">// Cắt tỉa 2: Đã đạt mức tiền tối đa, dừng toàn bộ vòng lặp người</span>
        <span class="kw">NẾU</span> (<span class="var">DP</span>[<span class="var">Cash</span>] ≠ <span class="val">Vô_Cực</span>) <span class="kw">THÌ THOÁT_LẶP</span>

    <span class="com">// Tìm mức tiền lớn nhất có thể trả và cộng quãng đường lùi</span>
    <span class="kw">LẶP</span> <span class="var">i</span> từ <span class="var">Cash</span> <span class="kw">GIẢM VỀ</span> <span class="val">0</span>:
        <span class="kw">NẾU</span> (<span class="var">DP</span>[<span class="var">i</span>] ≠ <span class="val">Vô_Cực</span>) <span class="kw">THÌ</span>:
            <span class="var">Extra_Dist</span> = <span class="var">Extra_Dist</span> + (<span class="val">2</span> * <span class="var">DP</span>[<span class="var">i</span>])
            <span class="kw">THOÁT_LẶP</span>

<span class="kw">XUẤT</span> <span class="var">N</span> + <span class="var">Extra_Dist</span>
</pre>
</div>

<div class="step-card border-purple">
    <div class="step-badge bg-purple">Bảng Đánh giá Thuật toán</div>
    
<div class="table-wrapper">
        <table class="algo-table">
            <thead>
                <tr>
                    <th style="width: 25%;">Đặc điểm</th>
                    <th class="th-green" style="width: 75%;">Tham lam + DP Knapsack (Duyệt ngược + Cắt tỉa)</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td class="td-label">Độ phức tạp Thời gian</td>
                    <td>$O(N + K \times \text{Cash})$ (với $K$ là số lượng người nợ còn lại ở cuối chặng). Tuy nhiên, nhờ kỹ thuật <b>duyệt ngược</b> và <b>cắt tỉa sớm (Early Exit)</b>, vòng lặp dừng ngay lập tức khi ghép được mức tiền tối đa, giúp tốc độ thực tế tăng lên gấp nhiều lần, chạy mượt mà ngay cả với dữ liệu lớn.</td>
                </tr>
                <tr>
                    <td class="td-label">Độ phức tạp Bộ nhớ</td>
                    <td>$O(N + \text{Cash})$. Cần không gian lưu danh sách nợ và mảng <code class="inline-code">DP[Cash + 1]</code>. Với mức Cash tối đa giả định khoảng $10^7$, mảng DP kiểu <code class="inline-code">int</code> chỉ tốn khoảng 40MB $\rightarrow$ Cực kỳ an toàn so với giới hạn bộ nhớ tiêu chuẩn (256MB) của các kỳ thi HSG.</td>
                </tr>
                <tr>
                    <td class="td-label">Sức mạnh Tối ưu<br><small style="font-weight:normal; color:#64748b;">(Test Case bẫy)</small></td>
                    <td><b>Đạt độ chính xác tuyệt đối!</b> Với dãy bẫy <code class="inline-code">-100, -200, ..., -900, 1000</code>, thuật toán tự động ghép thông minh mốc 400 và 600 để tiêu sạch 1000 đồng, tính chuẩn xác quãng đường lùi về vị trí của người -400 (phát sinh 12 bước $\rightarrow$ KQ: 22 bước).</td>
                </tr>
            </tbody>
        </table>
    </div>
</div>