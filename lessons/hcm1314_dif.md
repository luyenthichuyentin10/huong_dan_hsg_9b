## 🌗 Bài: Số khác nhau (DIF - HCM 2013-2014)
<br>
<div class="step-card border-blue">
<div class="step-badge bg-blue">Phân tích đề bài</div>

Cho một dãy có $N$ số nguyên ($1 < N \le 10^6$).

**Yêu cầu:** Tìm và đếm xem có bao nhiêu số **chỉ xuất hiện duy nhất một lần** trong dãy số đã cho.

**Ví dụ:**
- Dãy: `3 3 4 5 1 2 1 3 6`
- Phân tích:
    - Số `3`: xuất hiện 3 lần.
    - Số `1`: xuất hiện 2 lần.
    - Các số `4, 5, 2, 6`: mỗi số chỉ xuất hiện đúng 1 lần.
$\Rightarrow$ Kết quả: **4** (đó là các số 4, 5, 2, 6).
<div class="important-note">

**📌 Dạng bài:** Mảng đánh dấu - Map   
</div>
</div>

<div class="step-card border-orange">
<div class="step-badge bg-orange">Giải pháp thuật toán</div>

### 💡 Ý tưởng: Đếm tần suất xuất hiện
Chúng ta cần một cách để lưu trữ số lần xuất hiện của từng số trong dãy.

1. **Sử dụng Mảng đánh dấu (nếu giá trị số nhỏ):**
   - Tạo mảng `Count` có kích thước bằng giá trị lớn nhất của phần tử.
   - `Count[x]` lưu số lần xuất hiện của số `x`.

2. **Sử dụng Map/Dictionary (Tối ưu cho mọi trường hợp):**
   - Duyệt qua dãy số, với mỗi số `x`, tăng giá trị `Map[x]` lên 1.
   - Sau khi duyệt xong, duyệt lại các phần tử trong Map, nếu `Map[x] == 1` thì tăng biến đếm kết quả.

<div class = "important-note">

- **Thời gian:** $O(N)$ vì chúng ta chỉ cần duyệt dãy số 2 lần.
- **Không gian:** $O(N)$ để lưu trữ tần suất xuất hiện của các số khác nhau.
</div>

**Mã giả:**
<pre class="pseudocode">
<span class="var">Tan_suat</span> = {} <span class="com">// Sử dụng Map</span>
<span class="kw">CHO MỖI</span> <span class="var">x</span> <span class="kw">TRONG</span> <span class="var">Dãy_số</span>:
    <span class="var">Tan_suat</span>[<span class="var">x</span>] = <span class="var">Tan_suat</span>[<span class="var">x</span>] + <span class="val">1</span>;

<span class="var">so_luong</span> = <span class="val">0</span>;
<span class="kw">CHO MỖI</span> <span class="var">x</span> <span class="kw">TRONG</span> <span class="var">Tan_suat</span>:
    <span class="kw">NẾU</span> (<span class="var">Tan_suat</span>[<span class="var">x</span>] == <span class="val">1</span>) <span class="kw">THÌ</span> <span class="var">so_luong</span>++;

<span class="kw">XUẤT</span> <span class="var">so_luong</span>;
</pre>
</div>