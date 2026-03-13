## 🎫 Bài: Mua vé (BTICK - HCM 2016-2017)

<div class="step-card border-blue">
<div class="step-badge bg-blue">Phân tích đề bài</div>

Bờm cần đi ít nhất $n$ chuyến xe. Có 2 cách mua vé:
- Mua vé rời: Giá $p_1$ cho 1 vé.
- Mua theo tập: Giá $p_2$ cho 1 tập gồm $k$ vé.

**Yêu cầu:** Tìm số tiền ít nhất để mua đủ (hoặc dư) vé cho $n$ chuyến.

**Ví dụ:** $n = 12, k = 10, p_1 = 17, p_2 = 120$.
- Cách 1 (Chỉ mua vé rời): 12 vé $\times 17 = 204$.
- Cách 2 (Mua 2 tập vé): 2 tập $\times 120 = 240$ (được 20 vé, dư 8 vé).
- Cách 3 (Mua kết hợp): Mua 1 tập (được 10 vé, giá 120), còn thiếu 2 vé mua rời (giá $2 \times 17 = 34$). Tổng $= 120 + 34 = 154$.
$\Rightarrow$ Cách 3 rẻ nhất, đáp án là **154**.
<div class="important-note">

**📌 Dạng bài:** Tham lam  
</div>
</div>

<div class="step-card border-orange">
<div class="step-badge bg-orange">Giải pháp thuật toán</div>

### 💡 Ý tưởng Tối ưu hóa
Ta cần so sánh xem việc mua 1 tập vé ($k$ vé giá $p_2$) có rẻ hơn việc mua $k$ vé rời ($k \times p_1$) hay không.

**Trường hợp 1: Mua vé rời rẻ hơn hoặc bằng ($k \times p_1 \le p_2$)**
- Trong trường hợp này, việc mua tập vé hoàn toàn vô nghĩa vì mua lẻ còn rẻ hơn.
- Tổng chi phí = $n \times p_1$.

**Trường hợp 2: Mua tập vé rẻ hơn ($k \times p_1 > p_2$)**
- Ta nên ưu tiên mua càng nhiều tập vé càng tốt. Số tập vé có thể mua vừa vặn là: `tap = n / k` (chia lấy nguyên).
- Chi phí mua tập: `chi_phi_tap = tap * p_2`.
- Số chuyến còn dư: `du = n % k`.
- Đối với số chuyến dư này, ta lại có 2 lựa chọn:
    1. Mua `du` vé lẻ: Chi phí = `du * p_1`.
    2. Mua thêm hẳn 1 tập vé nữa (dù bị thừa vé nhưng có thể rẻ hơn mua lẻ): Chi phí = `p_2`.
- Ta chọn cách rẻ hơn cho phần dư: `min(du * p_1, p_2)`.

Tổng chi phí cho trường hợp 2: `chi_phi_tap + min(du * p_1, p_2)`.

⚠️ **Lưu ý kiểu dữ liệu:** Với $n, k, p_1, p_2 \le 10^9$, kết quả phép nhân có thể lên đến $10^{18}$. Bắt buộc phải sử dụng kiểu số nguyên lớn 64-bit (`long long` trong C++ hoặc `Int64` trong Pascal).
</div>

<div class="step-card border-green">
<div class="step-badge bg-green">Mã giả minh họa</div>

<pre class="pseudocode">
<span class="kw">NHẬP</span> <span class="var">n</span>, <span class="var">k</span>, <span class="var">p1</span>, <span class="var">p2</span>;

<span class="kw">NẾU</span> (<span class="var">k</span> * <span class="var">p1</span> <= <span class="var">p2</span>) <span class="kw">THÌ</span>:
    <span class="var">KetQua</span> = <span class="var">n</span> * <span class="var">p1</span>;
<span class="kw">NGƯỢC LẠI</span>:
    <span class="var">tap</span> = <span class="var">n</span> / <span class="var">k</span>;
    <span class="var">du</span> = <span class="var">n</span> % <span class="var">k</span>;
    
    <span class="var">chi_phi_tap</span> = <span class="var">tap</span> * <span class="var">p2</span>;
    <span class="var">chi_phi_du</span> = <span class="fn">MIN</span>(<span class="var">du</span> * <span class="var">p1</span>, <span class="var">p2</span>);
    
    <span class="var">KetQua</span> = <span class="var">chi_phi_tap</span> + <span class="var">chi_phi_du</span>;

<span class="kw">XUẤT</span> <span class="var">KetQua</span>;
</pre>
</div>