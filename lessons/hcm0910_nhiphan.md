## Bài: Nhị phân (Vị trí Bit 1)

<div class="step-card border-blue">
<div class="step-badge bg-blue">Phân tích đề bài</div>

Cho số nguyên dương $N$. Yêu cầu xác định vị trí của các chữ số $1$ trong biểu diễn nhị phân của $N$.

**Quy ước:** Vị trí tận cùng bên phải của khai triển nhị phân là vị trí $0$.

**Ví dụ:** $13_{10} = 1101_2$. 
- Các vị trí bit 1 là: $0, 2, 3$.
- Giải thích: $13 = 1 \cdot 2^3 + 1 \cdot 2^2 + 0 \cdot 2^1 + 1 \cdot 2^0$.
</div>

<div class="step-card border-orange">
<div class="step-badge bg-orange">Cách 1: Chuyển đổi cơ số (Dùng phép chia)</div>

### 💡 Ý tưởng thuật toán
Sử dụng phép chia lấy dư cho $2$ liên tiếp để trích xuất các bit từ phải sang trái. Mỗi lần chia, số dư chính là giá trị bit tại vị trí hiện tại.

**Mã giả thuật toán:**
<pre class="pseudocode">
<span class="var">Vị_trí</span> = <span class="val">0</span>;
<span class="kw">TRONG KHI</span> (<span class="var">N</span> > <span class="val">0</span>):
    <span class="kw">NẾU</span> (<span class="var">N</span> % <span class="val">2</span> == <span class="val">1</span>) <span class="kw">THÌ</span> <span class="kw">XUẤT</span> <span class="var">Vị_trí</span>;
    <span class="var">N</span> = <span class="var">N</span> / <span class="val">2</span>;
    <span class="var">Vị_trí</span> = <span class="var">Vị_trí</span> + <span class="val">1</span>;
</pre>
</div>

<div class="step-card border-purple">
<div class="step-badge bg-purple">Cách 2: Xử lý Bit trực tiếp (Tối ưu)</div>

### 💡 Ý tưởng thuật toán (Bitwise)
Máy tính lưu số nguyên ở hệ nhị phân, ta có thể dùng toán tử bit để truy xuất trực tiếp:
- **Toán tử AND (&):** `N & 1` trả về 1 nếu bit cuối là 1.
- **Toán tử Dịch phải (>>):** `N >> 1` dịch chuyển dãy bit sang phải (tương đương chia 2).

**Mã giả thuật toán:**
<pre class="pseudocode">
<span class="var">Vị_trí</span> = <span class="val">0</span>;
<span class="kw">TRONG KHI</span> (<span class="var">N</span> > <span class="val">0</span>):
    <span class="kw">NẾU</span> ((<span class="var">N</span> & <span class="val">1</span>) == <span class="val">1</span>) <span class="kw">THÌ</span> <span class="kw">XUẤT</span> <span class="var">Vị_trí</span>;
    <span class="var">N</span> = <span class="var">N</span> >> <span class="val">1</span>;
    <span class="var">Vị_trí</span> = <span class="var">Vị_trí</span> + <span class="val">1</span>;
</pre>
</div>