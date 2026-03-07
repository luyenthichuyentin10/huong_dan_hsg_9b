## 🤖 Bài: Vận tốc trung bình (Robot VAVG) 
<br>
<div class="step-card border-blue">
<div class="step-badge bg-blue">Phân tích đề bài</div>

Robot xuất phát tại tọa độ $(0, 0)$, hướng ban đầu nhìn về **chiều dương trục hoành** (hướng Đông). Robot nhận $N$ lệnh điều khiển:

-   **F K T**: Đi thẳng theo hướng hiện tại $K$ cm trong $T$ giây.
-   **R K T**: Rẽ phải $90^\circ$ và đi $K$ cm trong $T$ giây.
-   **L K T**: Rẽ trái $90^\circ$ và đi $K$ cm trong $T$ giây.

**Yêu cầu:** Tính vận tốc trung bình của Robot trên toàn bộ hành trình.

**Ví dụ:** Với các lệnh `F 7 5`, `R 8 6`, `F 3 1`, `L 9 5`:
- Tổng quãng đường $S = 7 + 8 + 3 + 9 = 27$
- Tổng thời gian $T = 5 + 6 + 1 + 5 = 17$
- Kết quả: $27 / 17 \approx 1.59$

<div class="important-note">

**📌 Dạng bài:** Addhoc - công thức tính vận tốc    
</div>
</div>

<div class="step-card border-orange">
<div class="step-badge bg-orange">Giải pháp thuật toán</div>

Ta duyệt qua các hướng đi, tính tổng quảng đường và tổng thời gian sau đó áp dụng công thức tính vận tốc
<div class="math-formula">
$V_{tb} = \frac{\text{Tổng quãng đường}}{\text{Tổng thời gian}}$
</div>
<div class="important-note">

⭐ Để định dạng 2 chữ số cố định phần thập phân ta sử dụng `cout << fixed << setprecision(2);` trước câu lệnh xuất kết quả
</div>

**Mã giả thuật toán tính toán:**
<pre class="pseudocode">
<span class="var">Tong_S</span> = <span class="val">0</span>;
<span class="var">Tong_T</span> = <span class="val">0</span>;

<span class="kw">CHO</span> <span class="var">i</span> từ <span class="val">1</span> <span class="kw">ĐẾN</span> <span class="var">N</span>:
    <span class="kw">ĐỌC</span> <span class="var">lenh</span>, <span class="var">K</span>, <span class="var">T</span>;
    <span class="var">Tong_S</span> = <span class="var">Tong_S</span> + <span class="var">K</span>;
    <span class="var">Tong_T</span> = <span class="var">Tong_T</span> + <span class="var">T</span>;

<span class="kw">XUẤT</span> <span class="fn">Làm_tròn</span>(<span class="var">Tong_S</span> / <span class="var">Tong_T</span>, <span class="val">2</span>);
</pre>
</div>