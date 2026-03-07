## 0️⃣1️⃣ Bài: Tổng nhị phân (HCM 2013-2014)
<br>
<div class="step-card border-blue">
<div class="step-badge bg-blue">Phân tích đề bài</div>

Cho $N$ số nguyên dương $k_1, k_2, ..., k_n$.

**Yêu cầu:** 
1. Chuyển mỗi số $k_i$ từ hệ thập phân sang hệ nhị phân.
2. Đếm số lượng chữ số `1` trong biểu diễn nhị phân của từng số.
3. Tính tổng số lượng chữ số `1` của tất cả $N$ số.

**Ví dụ:**
- Số 13 (thập phân) $\rightarrow$ `1101` (nhị phân) $\rightarrow$ Có **3** chữ số 1.
- Số 7 (thập phân) $\rightarrow$ `111` (nhị phân) $\rightarrow$ Có **3** chữ số 1.
$\Rightarrow$ Tổng cộng = $3 + 3 = 6$.
<div class="important-note">

**📌 Dạng bài:** Đổi hệ số - xử lý bit    
</div>
</div>

<div class="step-card border-orange">
<div class="step-badge bg-orange">Thuật toán 1: Chia dư để chuyển nhị phân</div>

### 💡 Tư duy
Để tìm các chữ số nhị phân của một số $k$, ta liên tục chia $k$ cho 2 và lấy phần dư cho đến khi $k = 0$.
- Nếu $k \pmod 2 = 1$, ta tăng biến đếm số chữ số 1.
- Sau đó gán $k = k / 2$.

**Mã giả:**
<pre class="pseudocode">
<span class="var">tong_tat_ca</span> = <span class="val">0</span>;
<span class="kw">CHO MỖI</span> <span class="var">k</span> trong danh sách:
    <span class="var">dem_so_1</span> = <span class="val">0</span>;
    <span class="kw">TRONG KHI</span> (<span class="var">k</span> > <span class="val">0</span>):
        <span class="kw">NẾU</span> (<span class="var">k</span> % <span class="val">2</span> == <span class="val">1</span>) <span class="kw">THÌ</span> <span class="var">dem_so_1</span>++;
        <span class="var">k</span> = <span class="var">k</span> / <span class="val">2</span>;
    <span class="var">tong_tat_ca</span> += <span class="var">dem_so_1</span>;
</pre>
</div>

<div class="step-card border-green">
<div class="step-badge bg-green">Thuật toán 2: Sử dụng toán tử Bitwise (Tối ưu)</div>

### 💡 Tư duy
Trong lập trình hiện đại (C++, Python), ta có thể sử dụng phép toán `AND` với số 1 để kiểm tra bit cuối cùng có phải là 1 hay không, và phép dịch bit `>>` để loại bỏ bit đã kiểm tra.

**Công thức:**
- Kiểm tra bit cuối: `(k & 1)` sẽ trả về 1 nếu bit cuối là 1, ngược lại là 0.
- Dịch phải 1 bit: `k >> 1` tương đương với `k / 2`.

**Mã giả C++:**
<pre class="pseudocode">
<span class="kw">int</span> <span class="fn">countOnes</span>(<span class="kw">int</span> <span class="var">n</span>) {
    <span class="kw">int</span> <span class="var">cnt</span> = <span class="val">0</span>;
    <span class="kw">while</span> (<span class="var">n</span> > <span class="val">0</span>) {
        <span class="var">cnt</span> += (<span class="var">n</span> & <span class="val">1</span>);
        <span class="var">n</span> >>= <span class="val">1</span>;
    }
    <span class="kw">return</span> <span class="var">cnt</span>;
}
</pre>
</div>