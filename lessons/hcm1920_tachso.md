## ✂️ Bài: Tách dãy số (TACHSO - HCM 2019-2020)
<br>
<div class="step-card border-blue">
<div class="step-badge bg-blue">Phân tích đề bài</div>

Cho một dãy số dài tối đa $10^4$ chữ số.
**Yêu cầu:** Tách dãy số từ trái qua phải thành các **số có nghĩa** tăng dần, sao cho độ chênh lệch giữa hai số liền nhau là nhỏ nhất. Tách cho đến khi không thể tách thêm.

**Giải mã từ khóa:**
1. **"Số có nghĩa" (Meaningful number):** Trong toán học, một số nguyên có nghĩa không bao giờ bắt đầu bằng chữ số `0` (ví dụ `07` là vô nghĩa, chỉ có `7` là có nghĩa). Suy ra: Bất kỳ đoạn cắt nào khiến phần còn lại bắt đầu bằng số `0` thì phần còn lại đó sẽ bị "tịt" (không thể tạo ra số hợp lệ tiếp theo).
2. **"Độ chênh lệch... là nhỏ nhất":** Nghĩa là tại mỗi bước, ta ưu tiên chọn số **nhỏ nhất có thể** (nhưng vẫn phải lớn hơn số trước đó).
3. **"Cho đến khi không thể tách thêm":** Nghĩa là ta phải cố gắng tách ra được **nhiều số nhất có thể**. Chỉ khi nào không còn đường lui mới chịu dừng lại.
<div class="important-note">

**📌 Dạng bài:** Xử lý chuỗi - tham lam
</div>
</div>

<div class="step-card border-orange">
<div class="step-badge bg-orange">Lỗi sai kinh điển</div>

Với dãy `23072007`:
- Bước 1: Cắt được số `2`. Số trước đó = 2.
- Bước 2: Thấy số `3` > 2, liền cắt ngay số `3` vì tham lam độ chênh lệch nhỏ nhất.
- Bước 3: Phần còn lại là `072007`. Bắt đầu bằng chữ số `0` $\rightarrow$ Vô nghĩa $\rightarrow$ Quá trình kết thúc sớm. Chỉ tách được 2 số là `2` và `3`.
- **Thực tế:** Nếu kiên nhẫn không cắt số `3` mà cắt `30`, phần còn lại là `72007` $\rightarrow$ Tách tiếp được `72` $\rightarrow$ Được tổng cộng 3 số là `2, 30, 72` (đúng như ví dụ đề bài).
</div>

<div class="step-card border-green">
<div class="step-badge bg-green">Giải pháp: Tham lam "Nhìn xa trông rộng" (Look-ahead Greedy)</div>

### 💡 Ý tưởng Tối ưu
Tại một vị trí, ta thử lấy các tiền tố (prefix) có độ dài tăng dần để tạo thành số `Cand` (Candidate).
- Điều kiện cần: `Cand > Prev` (Số mới phải lớn hơn số cũ).
- **Điều kiện đủ (Quan trọng):** Phần còn lại của chuỗi (gọi là `R`) phải **có khả năng sinh ra ít nhất 1 số hợp lệ nữa**.
  - `R` có khả năng sinh số khi: `R` không bắt đầu bằng `'0'` **VÀ** giá trị nguyên của toàn bộ chuỗi `R` phải lớn hơn `Cand`.
  - Vì `R` không có số 0 ở đầu, nên so sánh giá trị nguyên chính là so sánh độ dài chuỗi: `Len(R) > Len(Cand)` HOẶC (`Len(R) == Len(Cand)` VÀ `R > Cand`).

**Quy tắc cắt:**
- Tìm được `Cand` nhỏ nhất thỏa mãn cả điều kiện cần và đủ $\rightarrow$ CẮT!
- Nếu thử hết mọi độ dài mà không có `Cand` nào thỏa mãn điều kiện đủ (tức là chắc chắn bước này là bước cuối cùng), ta chỉ việc chọn `Cand` nhỏ nhất thỏa mãn điều kiện cần $\rightarrow$ CẮT VÀ DỪNG!

<pre class="pseudocode">
<span class="com">// Hàm so sánh 2 số dạng chuỗi (Tránh tràn số)</span>
<span class="kw">HÀM</span> <span class="fn">Is_Greater</span>(<span class="var">a</span>, <span class="var">b</span>):
    <span class="kw">NẾU</span> (<span class="var">a.length</span> > <span class="var">b.length</span>) <span class="kw">TRẢ VỀ ĐÚNG</span>
    <span class="kw">NẾU</span> (<span class="var">a.length</span> < <span class="var">b.length</span>) <span class="kw">TRẢ VỀ SAI</span>
    <span class="kw">TRẢ VỀ</span> (<span class="var">a</span> > <span class="var">b</span>)

<span class="com">// Hàm kiểm tra chuỗi R có đường lui không?</span>
<span class="kw">HÀM</span> <span class="fn">Can_Continue</span>(<span class="var">R</span>, <span class="var">val</span>):
    <span class="kw">NẾU</span> (<span class="var">R.length</span> == <span class="val">0</span>) <span class="kw">TRẢ VỀ SAI</span>
    <span class="kw">NẾU</span> (<span class="var">R[0]</span> == <span class="str">'0'</span>) <span class="kw">TRẢ VỀ SAI</span>
    <span class="kw">TRẢ VỀ</span> <span class="fn">Is_Greater</span>(<span class="var">R</span>, <span class="var">val</span>)

<span class="com">// THUẬT TOÁN CHÍNH</span>
<span class="kw">NHẬP</span> chuỗi <span class="var">S</span>
<span class="var">Ket_Qua</span> = []
<span class="var">prev</span> = <span class="str">"0"</span>
<span class="var">idx</span> = <span class="val">0</span>

<span class="kw">LẶP TRONG KHI</span> (<span class="var">idx</span> < <span class="var">S.length</span>):
    <span class="kw">NẾU</span> (<span class="var">S[idx]</span> == <span class="str">'0'</span>) <span class="kw">THÌ THOÁT_LẶP</span> <span class="com">// Dính số 0 vô nghĩa, tịt đường</span>
    
    <span class="var">found_cut</span> = <span class="kw">SAI</span>
    <span class="var">smallest_valid</span> = <span class="kw">RỖNG</span>
    
    <span class="kw">LẶP</span> độ_dài <span class="var">L</span> từ <span class="val">1</span> <span class="kw">ĐẾN</span> <span class="var">S.length</span> - <span class="var">idx</span>:
        <span class="var">Cand</span> = <span class="fn">Lay_Chuoi_Con</span>(<span class="var">S</span>, <span class="var">idx</span>, <span class="var">L</span>)
        
        <span class="kw">NẾU</span> (<span class="fn">Is_Greater</span>(<span class="var">Cand</span>, <span class="var">prev</span>)) <span class="kw">THÌ</span>:
            <span class="kw">NẾU</span> (<span class="var">smallest_valid</span> == <span class="kw">RỖNG</span>) <span class="kw">THÌ</span> <span class="var">smallest_valid</span> = <span class="var">Cand</span>
            
            <span class="var">R</span> = <span class="fn">Lay_Chuoi_Con</span>(<span class="var">S</span>, <span class="var">idx</span> + <span class="var">L</span>, <span class="kw">HẾT</span>)
            <span class="kw">NẾU</span> (<span class="fn">Can_Continue</span>(<span class="var">R</span>, <span class="var">Cand</span>)) <span class="kw">THÌ</span>:
                <span class="var">Ket_Qua</span>.Them(<span class="var">Cand</span>)
                <span class="var">prev</span> = <span class="var">Cand</span>
                <span class="var">idx</span> = <span class="var">idx</span> + <span class="var">L</span>
                <span class="var">found_cut</span> = <span class="kw">ĐÚNG</span>
                <span class="kw">THOÁT_LẶP</span>
                
    <span class="kw">NẾU</span> (<span class="var">found_cut</span> == <span class="kw">SAI</span>) <span class="kw">THÌ</span>:
        <span class="kw">NẾU</span> (<span class="var">smallest_valid</span> ≠ <span class="kw">RỖNG</span>) <span class="kw">THÌ</span>:
            <span class="var">Ket_Qua</span>.Them(<span class="var">smallest_valid</span>)
        <span class="kw">THOÁT_LẶP</span> <span class="com">// Chắc chắn dừng</span>

<span class="kw">XUẤT</span> <span class="fn">Kich_Thuoc</span>(<span class="var">Ket_Qua</span>)
<span class="kw">XUẤT</span> các phần tử trong <span class="var">Ket_Qua</span>
</pre>
</div>

<div class="step-card border-purple">
    <div class="step-badge bg-purple">Bảng Đánh giá Thuật toán</div>
    
<div class="table-wrapper">
        <table class="algo-table">
            <thead>
                <tr>
                    <th style="width: 25%;">Đặc điểm</th>
                    <th class="th-green" style="width: 75%;">Tham lam Look-ahead (Chuỗi)</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td class="td-label">Độ phức tạp Thời gian</td>
                    <td>Rất nhanh. Thay vì phải dùng QHĐ hoặc Quay lui, ta duyệt bằng chuỗi kết hợp logic Look-ahead. Do số được tách luôn tăng, chiều dài chuỗi tách tăng rất nhanh, vòng lặp trong chạy cực ít. Thuật toán dễ dàng vượt qua giới hạn $10^4$ ký tự trong chưa tới 0.1 giây.</td>
                </tr>
                <tr>
                    <td class="td-label">Kỹ thuật so sánh chuỗi</td>
                    <td>Do chuỗi có thể dài nghìn ký tự, việc tự viết hàm <code class="inline-code">Is_Greater</code> bằng cách so sánh độ dài trước, sau đó so sánh chuỗi (Lexicographical) là cực kỳ quan trọng để tránh tràn số.</td>
                </tr>
            </tbody>
        </table>
    </div>
</div>