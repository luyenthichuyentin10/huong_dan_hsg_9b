## Bài 1: Số dư

<div class="step-card border-blue">
<div class="step-badge bg-blue">Phân tích đề bài</div>

### 1. Ý nghĩa bài toán:
Bài toán yêu cầu chúng ta đếm xem trong 10 số nguyên cho trước, có bao nhiêu giá trị số dư khác nhau khi thực hiện phép chia các số đó cho $42$.
### 2. Các điểm cần lưu ý:
* Phép toán chủ đạo: Sử dụng phép chia lấy dư (toán tử % trong C++).
* Phạm vi số dư: Khi chia cho $42$, số dư $R$ luôn nằm trong khoảng $0 \le R < 42$. Như vậy, tối đa chỉ có thể có $42$ số dư khác nhau.
* Mục tiêu: Không phải đếm tổng số dư, mà là đếm các số dư không trùng lặp.
### 3. Giải thích ví dụ:
* Ví dụ 1: 10 số từ 1 đến 10 khi chia cho 42 sẽ cho 10 số dư lần lượt là $1, 2, 3, 4, 5, 6, 7, 8, 9, 10$. Vì 10 số dư này hoàn toàn khác nhau, kết quả xuất ra là 10.
* Ví dụ 2: Các số $42, 84, 252, 420, 840, 126$ đều là bội của $42$. Do đó, khi chia cho $42$, tất cả chúng đều có chung một số dư duy nhất là $0$. Vì chỉ có $1$ loại số dư xuất hiện, kết quả xuất ra là $1$.
</div>

<div class="step-card border-orange">
<div class="step-badge bg-orange">Phân tích thuật toán</div>

### 💡 Ý tưởng chính
Để đếm số lượng các giá trị khác nhau, chúng ta sử dụng một **mảng đánh dấu** (mảng boolean hoặc mảng số nguyên). 

1. Khi chia một số bất kỳ cho **42**, các số dư có thể nhận giá trị trong đoạn từ $[0, 41]$. Tổng cộng có tối đa 42 khả năng xảy ra.
2. Ta tạo một mảng `đánh_dấu[42]` khởi tạo ban đầu là 0 (chưa xuất hiện).
3. Với mỗi số $X$ đọc vào:
   - Tính số dư: $R = X \pmod{42}$.
   - Đánh dấu giá trị này đã xuất hiện: `đánh_dấu[R] = 1`.
4. Sau khi đọc hết 10 số, ta chỉ cần đếm xem trong mảng `đánh_dấu` có bao nhiêu vị trí mang giá trị **1**.

**Độ phức tạp:** $O(N)$ với $N=10$, cực kỳ tối ưu.
</div>

<div class="step-card border-green">
<div class="step-badge bg-green">Mã giả thuật toán</div>

<pre class="pseudocode">
<span class="kw">Khai báo</span> <span class="var">đánh_dấu</span>[42], <span class="var">đếm</span> = 0;
<span class="kw">Lặp</span> 10 lần:
    <span class="kw">Nhập</span> <span class="var">X</span>;
    <span class="var">R</span> = <span class="var">X</span> % 42;
    <span class="var">đánh_dấu</span>[<span class="var">R</span>] = 1;

<span class="kw">CHO</span> <span class="var">i</span> chạy từ 0 đến 41:
    <span class="kw">NẾU</span> <span class="var">đánh_dấu</span>[<span class="var">i</span>] == 1 <span class="kw">THÌ</span>:
        <span class="var">đếm</span> = <span class="var">đếm</span> + 1;

<span class="kw">XUẤT</span> <span class="var">đếm</span>;
</pre>
</div>