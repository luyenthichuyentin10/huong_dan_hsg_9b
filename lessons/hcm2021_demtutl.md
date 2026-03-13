## 🆓 Bài 2: Đếm từ trùng lặp (DEMTUTL - HCM 2020-2021)
<br>
<div class="step-card border-blue">
<div class="step-badge bg-blue">Phân tích đề bài</div>

Cho một văn bản gồm các ký tự ASCII trên nhiều dòng. Cần tìm và in ra các "từ trùng lặp".

**Định nghĩa "Từ":** Chỉ chứa các ký tự trong bảng chữ cái tiếng Anh (A-Z, a-z). Do đó, các dấu câu như chấm, phẩy, chấm than (`!`) hay chữ số đều đóng vai trò là dấu phân cách (Delimiter) giống như khoảng trắng. Ví dụ: `moi!` sẽ được tách thành từ `moi`.

**Hai dạng "Từ trùng lặp" (Không phân biệt hoa thường):**
- **Dạng 1:** Một từ có chứa ít nhất 2 ký tự giống nhau. Ví dụ: `chanh` (lặp chữ `h`), `Tat` (lặp chữ `t`).
- **Dạng 2:** Hai từ liền kề nhau giống hệt nhau. Ví dụ: `Xinh xinh`, `ao ao`. Dạng này **được tính là MỘT lần trùng lặp**, và khi in kết quả phải in cả 2 từ ra.

**Yêu cầu:** In ra số lượng từ trùng lặp và danh sách các từ đó theo thứ tự xuất hiện.
<div class="important-note">

**📌 Dạng bài:** Xử lý chuỗi
</div>
</div>

<div class="step-card border-orange">
<div class="step-badge bg-orange">Cạm bẫy cần tránh</div>

1. **Lỗi xử lý dấu câu:** Rất nhiều học sinh dùng hàm `split(" ")` (tách theo khoảng trắng). Kết quả từ `moi!` sẽ mang theo cả dấu `!`. Khi kiểm tra Dạng 1 hoặc so sánh Dạng 2 sẽ bị sai. Phải duyệt chuỗi và chỉ lấy các ký tự chữ cái `a-z, A-Z`.
2. **Lỗi đếm chồng chéo (Overlapping):** Nếu gặp đoạn văn `chanh chanh` (2 từ liên tiếp giống nhau, và bản thân từ `chanh` cũng lặp chữ cái). Ta phải **ưu tiên kiểm tra Dạng 2 trước**. Nếu nó là Dạng 2, gộp cả 2 từ lại, đếm là 1, và phải **nhảy cóc (bỏ qua)** từ thứ hai để không bị xét lại Dạng 1 ở bước sau.
3. **Lỗi phân biệt hoa thường:** Đề yêu cầu "Không phân biệt hoa thường". Phải chuyển tất cả về chữ thường (lowercase) trước khi đếm chữ cái hoặc so sánh 2 từ, nhưng **khi in ra phải giữ nguyên định dạng ban đầu**.
</div>

<div class="step-card border-green">
<div class="step-badge bg-green">Giải pháp: Tách từ (Tokenize) & Quét tuyến tính (O(W))</div>

### 💡 Ý tưởng Thuật toán
1. **Tiền xử lý (Tokenization):** Duyệt qua toàn bộ văn bản. Cứ hễ gặp ký tự thuộc `a-z` hoặc `A-Z` thì nối vào biến tạm. Gặp ký tự khác (khoảng trắng, dấu câu...) thì chốt biến tạm thành 1 "Từ" đẩy vào mảng `Words`. (Trong C++/Python, có thể dùng Regex `[a-zA-Z]+` để lấy mảng này cực nhanh).
2. **Quét mảng Words:** Duyệt `i` từ $0$ đến $W - 1$.
   - **Xét Dạng 2 (Nhìn về phía trước):** Nếu `LOWER(Words[i]) == LOWER(Words[i+1])`, ta ghi nhận kết quả là cụm `Words[i] + " " + Words[i+1]`. Tăng biến đếm. Tăng `i` thêm 1 bước (nhảy cóc) để bỏ qua từ `i+1`.
   - **Xét Dạng 1 (Đếm tần số ký tự):** Nếu không thỏa mãn Dạng 2, ta đếm tần số các chữ cái trong `LOWER(Words[i])`. Nếu có ký tự xuất hiện $\ge 2$ lần, ghi nhận `Words[i]`. Tăng biến đếm.

<pre class="pseudocode">
<span class="kw">HÀM</span> <span class="fn">Kiem_Tra_Dang_1</span>(<span class="var">word</span>):
    <span class="var">w</span> = <span class="fn">TO_LOWER</span>(<span class="var">word</span>)
    <span class="var">Dem</span> = <span class="fn">Mang</span>(26, <span class="val">0</span>)
    <span class="kw">LẶP MỖI</span> <span class="var">char</span> <span class="kw">TRONG</span> <span class="var">w</span>:
        <span class="var">idx</span> = <span class="var">char</span> - <span class="str">'a'</span>
        <span class="var">Dem</span>[<span class="var">idx</span>] = <span class="var">Dem</span>[<span class="var">idx</span>] + <span class="val">1</span>
        <span class="kw">NẾU</span> (<span class="var">Dem</span>[<span class="var">idx</span>] ≥ <span class="val">2</span>) <span class="kw">THÌ TRẢ VỀ ĐÚNG</span>
    <span class="kw">TRẢ VỀ SAI</span>

<span class="com">// CHƯƠNG TRÌNH CHÍNH</span>
<span class="kw">NHẬP</span> toàn bộ văn bản <span class="var">S</span>
<span class="var">Words</span> = <span class="fn">Tach_Lay_Cac_Tu_Tieng_Anh</span>(<span class="var">S</span>)
<span class="var">Ket_Qua</span> = []

<span class="var">i</span> = <span class="val">0</span>
<span class="kw">LẶP TRONG KHI</span> (<span class="var">i</span> < <span class="fn">Kich_Thuoc</span>(<span class="var">Words</span>)):
    <span class="var">tu_hien_tai</span> = <span class="var">Words</span>[<span class="var">i</span>]
    
    <span class="com">// Ưu tiên kiểm tra Dạng 2 trước</span>
    <span class="kw">NẾU</span> (<span class="var">i</span> + <span class="val">1</span> < <span class="fn">Kich_Thuoc</span>(<span class="var">Words</span>)):
        <span class="var">tu_tiep_theo</span> = <span class="var">Words</span>[<span class="var">i</span> + <span class="val">1</span>]
        <span class="kw">NẾU</span> (<span class="fn">TO_LOWER</span>(<span class="var">tu_hien_tai</span>) == <span class="fn">TO_LOWER</span>(<span class="var">tu_tiep_theo</span>)) <span class="kw">THÌ</span>:
            <span class="var">Ket_Qua</span>.Them(<span class="var">tu_hien_tai</span> + <span class="str">" "</span> + <span class="var">tu_tiep_theo</span>)
            <span class="var">i</span> = <span class="var">i</span> + <span class="val">2</span> <span class="com">// Nhảy cóc qua từ thứ 2</span>
            <span class="kw">TIẾP_TỤC_LẶP</span> <span class="com">// Bỏ qua các lệnh bên dưới, sang vòng mới</span>

    <span class="com">// Nếu không phải Dạng 2, kiểm tra Dạng 1</span>
    <span class="kw">NẾU</span> (<span class="fn">Kiem_Tra_Dang_1</span>(<span class="var">tu_hien_tai</span>) == <span class="kw">ĐÚNG</span>) <span class="kw">THÌ</span>:
        <span class="var">Ket_Qua</span>.Them(<span class="var">tu_hien_tai</span>)
        
    <span class="var">i</span> = <span class="var">i</span> + <span class="val">1</span>

<span class="kw">XUẤT</span> <span class="fn">Kich_Thuoc</span>(<span class="var">Ket_Qua</span>)
<span class="kw">LẶP MỖI</span> <span class="var">item</span> <span class="kw">TRONG</span> <span class="var">Ket_Qua</span>:
    <span class="kw">XUẤT</span> <span class="var">item</span>
</pre>
</div>