## 🔤 Bài 1: Chuỗi 
<br>
<div class="step-card border-blue">
<div class="step-badge bg-blue">Phân tích đề bài</div>

Bài toán yêu cầu thực hiện biến đổi một chuỗi ký tự (bao gồm chữ thường và chữ hoa Latin) theo 3 thao tác cụ thể:
1.  **Xóa bỏ** tất cả các nguyên âm: `"A", "O", "Y", "E", "U", "I"` (không phân biệt hoa thường).
2.  **Chèn** một dấu chấm `.` vào trước mỗi phụ âm còn lại.
3.  **Chuyển đổi** tất cả các phụ âm viết hoa thành viết thường.

**Ví dụ:**
- `tour` &rarr; `.t.r` (Xóa 'o', 'u'; thêm '.' trước 't', 'r')
- `Codeforces` &rarr; `.c.d.f.r.c.s`
- `aBAcAba` &rarr; `.b.c.b`

<div class="important-note">

**📌 Dạng bài:** Addhoc - xử lý chuỗi
</div>
</div>

<div class="step-card border-orange">
<div class="step-badge bg-orange">Giải pháp thuật toán</div>

Duyệt qua từng ký tự của chuỗi ban đầu. Với mỗi ký tự, ta thực hiện các bước kiểm tra:
- Nếu là nguyên âm: Bỏ qua, không đưa vào kết quả.
- Nếu là phụ âm: 
    - Chuyển về chữ thường (nếu đang là chữ hoa).
    - Thêm dấu chấm `.` vào chuỗi kết quả.
    - Thêm phụ âm đã chuyển đổi vào chuỗi kết quả.

**Mã giả thuật toán:**
<pre class="pseudocode">
<span class="var">Kết_quả</span> = <span class="val">""</span>;
<span class="var" style="color: #e4e121;">Nguyên_âm</span> = <span class="val">"aoyeui"</span>;

<span class="kw">CHO MỖI</span> <span class="var">kí_tự</span> <span class="kw">TRONG</span> <span class="var">Chuỗi_nhập</span>:
    <span class="var">c</span> = <span class="fn">Chuyển_về_chữ_thường</span>(<span class="var">kí_tự</span>);
    
    <span class="kw">NẾU</span> (<span class="var">c</span> <span class="kw">KHÔNG THUỘC</span> <span class="var">Nguyên_âm</span>) <span class="kw">THÌ</span>:
        <span class="var">Kết_quả</span> = <span class="var">Kết_quả</span> + <span class="val">"."</span> + <span class="var">c</span>;

<span class="kw">XUẤT</span> <span class="var">Kết_quả</span>;
</pre>
</div>

<div class="step-card border-green">
<div class="step-badge bg-green">Độ phức tạp</div>

- **Thời gian:** $O(N)$ với $N$ là chiều dài chuỗi, vì ta chỉ duyệt qua chuỗi đúng một lần.
- **Không gian:** $O(N)$ để lưu trữ chuỗi kết quả mới.
</div>