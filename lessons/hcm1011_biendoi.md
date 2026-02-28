## Bài 3: Biến đổi

<div class="step-card border-blue">
<div class="step-badge bg-blue">Phân tích đề bài</div>

### 1. Quy tắc biến đổi
Bắt đầu từ một dãy chỉ gồm một số $1$. Tại mỗi bước, tất cả các chữ số trong dãy đồng thời biến đổi theo quy tắc:
* Chữ số $0$ $\rightarrow$ thành dãy $1$ $0$
* Chữ số $1$ $\rightarrow$ thành dãy $0$ $1$

### 2. Ví dụ minh họa quá trình
* **Bước 0:** 1
* **Bước 1:** 0 1 (số 1 biến thành 0 1)
* **Bước 2:** 1 0 0 1 (số 0 $\rightarrow$ 1 0, số 1 $\rightarrow$ 0 1)
* **Bước 3:** 0 1 1 0 1 0 0 1

**Yêu cầu:** Sau $n$ bước, có bao nhiêu cặp số $0$ liên tiếp ($0$ $0$) xuất hiện trong dãy. Kết quả lấy dư cho $10^9 + 7$.

### 3. Giải thích ví dụ
* Với $n=2$: Dãy là 1 0 0 1. Có **1** cặp $0$ $0$.
* Với $n=3$: Dãy là 0 1 1 0 1 0 0 1. Có **1** cặp $0$ $0$.
* Với $n=4$: Sau khi biến đổi từ bước 3, ta sẽ có **3** cặp $0$ $0$.
</div>

<div class="step-card border-orange">
<div class="step-badge bg-orange">Subtask 1: Vét cạn (N ≤ 20)</div>

### 💡 Phân tích thuật toán
Với $N$ nhỏ, ta có thể mô phỏng trực tiếp quá trình thay thế các phần tử trong mảng hoặc vector.

**Mã giả thuật toán:**
<pre class="pseudocode">
<span class="kw">Khởi tạo</span> <span class="var" style="color: #e4e121;">S</span> = {<span class="val" style="color: #ff4d4d;">1</span>};
<span class="kw">LẶP</span> <span class="var" style="color: #e4e121;">n</span> lần:
    <span class="kw">Khởi tạo</span> <span class="var" style="color: #e4e121;">S_mới</span> rỗng;
    <span class="kw">CHO MỖI</span> <span class="var" style="color: #e4e121;">x</span> trong <span class="var" style="color: #e4e121;">S</span>:
        <span class="kw">NẾU</span> <span class="var" style="color: #e4e121;">x</span> == <span class="val" style="color: #ff4d4d;">1</span> <span class="kw">THÌ</span> thêm {<span class="val" style="color: #ff4d4d;">0</span>, <span class="val" style="color: #ff4d4d;">1</span>} vào <span class="var" style="color: #e4e121;">S_mới</span>;
        <span class="kw">NGƯỢC LẠI</span> thêm {<span class="val" style="color: #ff4d4d;">1</span>, <span class="val" style="color: #ff4d4d;">0</span>} vào <span class="var" style="color: #e4e121;">S_mới</span>;
    <span class="var" style="color: #e4e121;">S</span> = <span class="var" style="color: #e4e121;">S_mới</span>;

<span class="var" style="color: #e4e121;">đếm</span> = <span class="val" style="color: #ff4d4d;">0</span>;
<span class="kw">Duyệt</span> <span class="var" style="color: #e4e121;">i</span> từ đầu đến kế cuối:
    <span class="kw">NẾU</span> <span class="var" style="color: #e4e121;">S</span>[<span class="var" style="color: #e4e121;">i</span>] == <span class="val" style="color: #ff4d4d;">0</span> VÀ <span class="var" style="color: #e4e121;">S</span>[<span class="var" style="color: #e4e121;">i+1</span>] == <span class="val" style="color: #ff4d4d;">0</span> <span class="kw">THÌ</span> <span class="var" style="color: #e4e121;">đếm</span>++;
</pre>
</div>

<div class="step-card border-green">
<div class="step-badge bg-green">Subtask 2: Tìm quy luật (N ≤ 10⁸)</div>

### 💡 Phân tích công thức
Khi quan sát số cặp `0 0` qua từng bước:
* $n=1 \rightarrow 0$
* $n=2 \rightarrow 1$
* $n=3 \rightarrow 1$
* $n=4 \rightarrow 3$
* $n=5 \rightarrow 5$
* $n=6 \rightarrow 11$

**Quy luật:** Gọi $R_n$ là số cặp `0 0` ở bước $n$.
* Nếu $n$ lẻ: $R_n = 2 \times R_{n-1} - 1$
* Nếu $n$ chẵn: $R_n = 2 \times R_{n-1} + 1$
*(Lưu ý: Công thức lấy dư cho $10^9 + 7$ trong quá trình tính toán)*.

**Mã giả tối ưu:**
<pre class="pseudocode">
<span class="var" style="color: #e4e121;">r</span> = <span class="val" style="color: #ff4d4d;">0</span>;
<span class="kw">CHO</span> <span class="var" style="color: #e4e121;">i</span> chạy từ <span class="val" style="color: #ff4d4d;">1</span> đến <span class="var" style="color: #e4e121;">n</span> - <span class="val" style="color: #ff4d4d;">1</span>:
    <span class="kw">NẾU</span> <span class="var" style="color: #e4e121;">i</span> lẻ <span class="kw">THÌ</span>:
        <span class="var" style="color: #e4e121;">r</span> = (<span class="var" style="color: #e4e121;">r</span> * <span class="val" style="color: #ff4d4d;">2</span> + <span class="val" style="color: #ff4d4d;">1</span>) % <span class="var" style="color: #e4e121;">MOD</span>;
    <span class="kw">NGƯỢC LẠI</span> (<span class="var" style="color: #e4e121;">i</span> chẵn):
        <span class="var" style="color: #e4e121;">r</span> = (<span class="var" style="color: #e4e121;">r</span> * <span class="val" style="color: #ff4d4d;">2</span> - <span class="val" style="color: #ff4d4d;">1</span> + <span class="var" style="color: #e4e121;">MOD</span>) % <span class="var" style="color: #e4e121;">MOD</span>;
<span class="kw">XUẤT</span> <span class="var" style="color: #e4e121;">r</span>;
</pre>
</pre>
</div>