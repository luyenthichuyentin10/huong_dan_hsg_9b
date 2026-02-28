## Bài 2: Hàm Mobius

<div class="step-card border-blue">
<div class="step-badge bg-blue">Phân tích đề bài</div>

1. **Ý nghĩa bài toán:** Bài toán yêu cầu tính giá trị của hàm Mobius $M(n)$ dựa trên việc phân tích số nguyên dương $n$ thành các thừa số nguyên tố.
2. **Các quy tắc xác định $M(n)$**
    * Quy tắc 1: Nếu $n = 1$ thì $M(n) = 1$.
    * Quy tắc 2: Nếu trong khai triển thừa số nguyên tố của $n$, có ít nhất một số nguyên tố xuất hiện từ 2 lần trở lên (tức là $n$ chia hết cho một số chính phương $i^2 > 1$) thì $M(n) = 0$.
    * Quy tắc 3: Nếu $n$ là tích của $p$ số nguyên tố khác nhau (mỗi số chỉ xuất hiện đúng 1 lần) thì $M(n) = (-1)^p$.

3. **Giải thích ví dụ**
    * Ví dụ 1 ($n=78$): Phân tích $78 = 2 \times 3 \times 13$. Có $p=3$ ước nguyên tố phân biệt. Vậy $M(78) = (-1)^3 = -1$.
    * Ví dụ 2 ($n=34$): Phân tích $34 = 2 \times 17$. Có $p=2$ ước nguyên tố phân biệt. Vậy $M(34) = (-1)^2 = 1$.
    * Ví dụ 3 ($n=45$): Phân tích $45 = 3 \times 3 \times 5 = 3^2 \times 5$. Vì ước nguyên tố $3$ xuất hiện $2$ lần (mũ của $3$ là $2 > 1$) nên $M(45) = 0$.

</div>

<div class="step-card border-orange">
    <div class="step-badge bg-orange">Phân tích thuật toán</div>

### 💡 Ý tưởng chính
Thuật toán dựa trên việc **phân tích thừa số nguyên tố** của số $n$:

1. **Trường hợp đặc biệt:** Nếu $n = 1$, kết quả là $1$.
2. **Phân tích thừa số:** Duyệt các số $i$ từ $2$ đến $\sqrt{n}$. Nếu $n$ chia hết cho $i$:
   - Đếm số lần xuất hiện của ước $i$. Nếu $i$ xuất hiện **nhiều hơn 1 lần** ($n$ chia hết cho $i^2$), ta kết luận ngay $M(n) = 0$.
   - Nếu $i$ chỉ xuất hiện 1 lần, ta tăng biến đếm số lượng ước nguyên tố $p$ lên 1.
3. **Số dư cuối cùng:** Sau vòng lặp, nếu $n > 1$ thì số dư đó chính là ước nguyên tố cuối cùng. Ta tăng $p$ thêm 1.
4. **Kết quả:** Nếu không rơi vào trường hợp $M(n) = 0$, kết quả sẽ là $(-1)^p$.

**Độ phức tạp:** $O(\sqrt{n})$, rất nhanh với $n \le 10^4$.
</div>

<div class="step-card border-green">
    <div class="step-badge bg-green">Mã giả thuật toán</div>

<pre class="pseudocode">
<span class="kw">NHẬP</span> <span class="var">n</span>;
<span class="kw">NẾU</span> <span class="var">n</span> == 1 <span class="kw">THÌ</span> <span class="kw">XUẤT</span> 1; <span class="kw">DỪNG</span>;

<span class="var">p</span> = 0; <span class="com">// Số lượng ước nguyên tố</span>
<span class="kw">CHO</span> <span class="var">i</span> chạy từ 2 đến <span class="kw">CĂN</span>(<span class="var">n</span>):
    <span class="kw">NẾU</span> <span class="var">n</span> % <span class="var">i</span> == 0 <span class="kw">THÌ</span>:
        <span class="var">d</span> = 0; <span class="com">// Đếm số mũ của i</span>
        <span class="kw">TRONG KHI</span> <span class="var">n</span> % <span class="var">i</span> == 0 <span class="kw">THÌ</span>:
            <span class="var">d</span>++;
            <span class="var">n</span> = <span class="var">n</span> / <span class="var">i</span>;
            <span class="var">p</span>++;
        <span class="kw">NẾU</span> <span class="var">d</span> > 1 <span class="kw">THÌ</span> <span class="kw">XUẤT</span> 0; <span class="kw">DỪNG</span>;

<span class="kw">NẾU</span> <span class="var">n</span> > 1 <span class="kw">THÌ</span> <span class="var">p</span>++;
<span class="kw">XUẤT</span> <span class="fn">LŨY_THỪA</span>(-1, <span class="var">p</span>);
</pre>
</div>