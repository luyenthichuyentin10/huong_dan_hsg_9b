## 🌱 Bài: Tưới ruộng (FARM - HCM 2017-2018)
<br>
<div class="step-card border-blue">
<div class="step-badge bg-blue">Phân tích đề bài</div>

Cho một khu ruộng kích thước $M \times N$ ($1 < M, N \le 100$).
Có $K$ cái giếng ($0 \le K \le 10^4$), mỗi giếng cung cấp nước cho các thửa ruộng xung quanh trong phạm vi **bán kính 2 ô vuông** đơn vị.
**Yêu cầu:** Đếm số lượng thửa ruộng (ô vuông) không được tưới nước (các ô tô đen trong hình).

**Phân tích "bán kính 2 ô vuông":**
Dựa vào hình ảnh minh họa trong đề bài với cái giếng ở tọa độ (3, 2), ta thấy vùng nước tưới tỏa ra thành một hình vuông kích thước $5 \times 5$ nhận ô chứa giếng làm tâm. 
Cụ thể, nếu giếng ở tọa độ $(r, c)$, nó sẽ tưới cho tất cả các ô $(i, j)$ thỏa mãn đồng thời:
- $|i - r| \le 2$ (Cách dòng không quá 2 ô)
- $|j - c| \le 2$ (Cách cột không quá 2 ô)
<div class="important-note">

**📌 Dạng bài:** Ma trận đánh dấu
</div>
</div>

<div class="step-card border-orange">
<div class="step-badge bg-orange">Giải pháp Thuật toán: Mảng đánh dấu (Marking Array)</div>

### 💡 Ý tưởng
Bài toán này có kích thước bản đồ rất nhỏ ($M, N \le 100$, tối đa $10.000$ ô). Ta hoàn toàn có thể dùng một mảng 2 chiều kiểu `boolean` để mô phỏng lại trạng thái của từng ô ruộng.
1. Khởi tạo mảng `Tuoi[M][N]` mang giá trị `false` (toàn bộ ruộng đang khô).
2. Duyệt qua từng giếng nước ở vị trí $(r, c)$.
3. Quét các ô xung quanh giếng từ dòng `r-2` đến `r+2` và cột `c-2` đến `c+2`. Chuyển trạng thái các ô này thành `true` (đã có nước).
   *Lưu ý cực kỳ quan trọng:* Phải kiểm tra điều kiện biên để không bị lỗi tràn mảng (Index Out of Bounds) khi giếng nằm gần mép bản đồ. Ta dùng hàm `MAX(1, r-2)` và `MIN(M, r+2)`.
4. Duyệt lại toàn bộ mảng `Tuoi`, đếm số lượng ô vẫn còn mang giá trị `false`.

**Độ phức tạp:**
- **Thời gian:** Quét $K$ giếng, mỗi giếng quét tối đa 25 ô $\rightarrow 25 \times K$. Duyệt đếm lại mất $M \times N$. Tổng thời gian: $O(K + M \times N)$. Với số liệu lớn nhất là $10000 + 10000 = 20000$ phép tính, thuật toán chạy cực kỳ nhanh (dưới 0.01 giây).
- **Không gian (Bộ nhớ):** Mảng 2 chiều kích thước $100 \times 100$ kiểu `boolean` chỉ tốn khoảng $10$ KB, hoàn toàn tối ưu.
</div>

<div class="step-card border-green">
<div class="step-badge bg-green">Mã giả thuật toán</div>

<pre class="pseudocode">
<span class="kw">NHẬP</span> <span class="var">M</span>, <span class="var">N</span>
<span class="kw">NHẬP</span> <span class="var">K</span>

<span class="com">// Khởi tạo mảng đánh dấu (tất cả đều chưa tưới)</span>
<span class="var">Tuoi</span>[<span class="var">1..M</span>][<span class="var">1..N</span>] = <span class="kw">false</span>

<span class="com">// Quét từng giếng nước</span>
<span class="kw">LẶP</span> <span class="var">k</span> từ <span class="val">1</span> <span class="kw">ĐẾN</span> <span class="var">K</span>:
    <span class="kw">NHẬP</span> <span class="var">r</span>, <span class="var">c</span>
    
    <span class="com">// Chặn giới hạn để không quét lố ra ngoài bản đồ</span>
    <span class="var">dong_tren</span> = <span class="fn">MAX</span>(<span class="val">1</span>, <span class="var">r</span> - <span class="val">2</span>)
    <span class="var">dong_duoi</span> = <span class="fn">MIN</span>(<span class="var">M</span>, <span class="var">r</span> + <span class="val">2</span>)
    <span class="var">cot_trai</span> = <span class="fn">MAX</span>(<span class="val">1</span>, <span class="var">c</span> - <span class="val">2</span>)
    <span class="var">cot_phai</span> = <span class="fn">MIN</span>(<span class="var">N</span>, <span class="var">c</span> + <span class="val">2</span>)
    
    <span class="com">// Đánh dấu vùng bán kính 2 ô</span>
    <span class="kw">LẶP</span> <span class="var">i</span> từ <span class="var">dong_tren</span> <span class="kw">ĐẾN</span> <span class="var">dong_duoi</span>:
        <span class="kw">LẶP</span> <span class="var">j</span> từ <span class="var">cot_trai</span> <span class="kw">ĐẾN</span> <span class="var">cot_phai</span>:
            <span class="var">Tuoi</span>[<span class="var">i</span>][<span class="var">j</span>] = <span class="kw">true</span>

<span class="com">// Đếm các ô ruộng chưa được tưới</span>
<span class="var">so_o_kho</span> = <span class="val">0</span>
<span class="kw">LẶP</span> <span class="var">i</span> từ <span class="val">1</span> <span class="kw">ĐẾN</span> <span class="var">M</span>:
    <span class="kw">LẶP</span> <span class="var">j</span> từ <span class="val">1</span> <span class="kw">ĐẾN</span> <span class="var">N</span>:
        <span class="kw">NẾU</span> (<span class="var">Tuoi</span>[<span class="var">i</span>][<span class="var">j</span>] == <span class="kw">false</span>) <span class="kw">THÌ</span>:
            <span class="var">so_o_kho</span> = <span class="var">so_o_kho</span> + <span class="val">1</span>

<span class="kw">XUẤT</span> <span class="var">so_o_kho</span>
</pre>
</div>