## <i class="fas fa-th"></i> Bài: Lưới vuông (SQUARE - HCM 2013-2014)

<div class="step-card border-blue">
<div class="step-badge bg-blue">Phân tích đề bài</div>

Cho một lưới ô vuông kích thước $N \times N$ ($1 < N \le 1000$) gồm các số 0 và 1.
Một số **1 cô độc** là số 1 mà các ô chung cạnh với nó (không tính ô chéo) đều là số 0.

**Yêu cầu:** Đếm tổng số lượng các ô số 1 cô độc có trong lưới.

**Ví dụ:** Với lưới $3 \times 3$
```
1 0 1
0 0 1
0 0 0
```
- Ô (1, 1) là số 1. Các ô xung quanh là (1, 2) và (2, 1) đều là 0. &rarr; **Cô độc**.
- Ô (1, 3) là số 1. Ô dưới nó là (2, 3) là số 1. &rarr; **Không cô độc**.
- Ô (2, 3) là số 1. Ô trên nó là (1, 3) là số 1. &rarr; **Không cô độc**.
$\Rightarrow$ Kết quả: **1**.
<div class="important-note">

**📌 Dạng bài:** Duyệt ma trận    
</div>
</div>

<div class="step-card border-orange">
<div class="step-badge bg-orange">Giải pháp thuật toán</div>

### 💡 Ý tưởng: Duyệt và Kiểm tra lân cận
Duyệt qua từng ô $(i, j)$ của lưới. Nếu ô đó chứa giá trị 1, ta tiến hành kiểm tra 4 ô lân cận chung cạnh:
- Ô phía trên: $(i-1, j)$
- Ô phía dưới: $(i+1, j)$
- Ô bên trái: $(i, j-1)$
- Ô bên phải: $(i, j+1)$

**Lưu ý:** Cần xử lý các ô ở biên (hàng 1, hàng N, cột 1, cột N) để tránh truy cập ngoài phạm vi mảng.

<div class = "important-note">

- **Thời gian:** $O(N^2)$ vì cần duyệt qua tất cả các ô trong lưới.
- **Không gian:** $O(N^2)$ để lưu trữ ma trận lưới.
</div>

**Mã giả:**
<pre class="pseudocode">
<span class="var">dem_co_doc</span> = <span class="val">0</span>;
<span class="kw">CHO</span> <span class="var">i</span> từ <span class="val">1</span> <span class="kw">ĐẾN</span> <span class="var">N</span>:
    <span class="kw">CHO</span> <span class="var">j</span> từ <span class="val">1</span> <span class="kw">ĐẾN</span> <span class="var">N</span>:
        <span class="kw">NẾU</span> (<span class="var">A[i][j]</span> == <span class="val">1</span>) <span class="kw">THÌ</span>:
            <span class="var">la_co_doc</span> = <span class="kw">true</span>;
            <span class="com">// Kiểm tra 4 hướng, bỏ qua nếu nằm ngoài biên</span>
            <span class="kw">NẾU</span> (<span class="var">A[i-1][j]</span> == <span class="val">1</span>) <span class="var">la_co_doc</span> = <span class="kw">false</span>;
            <span class="kw">NẾU</span> (<span class="var">A[i+1][j]</span> == <span class="val">1</span>) <span class="var">la_co_doc</span> = <span class="kw">false</span>;
            <span class="kw">NẾU</span> (<span class="var">A[i][j-1]</span> == <span class="val">1</span>) <span class="var">la_co_doc</span> = <span class="kw">false</span>;
            <span class="kw">NẾU</span> (<span class="var">A[i][j+1]</span> == <span class="val">1</span>) <span class="var">la_co_doc</span> = <span class="kw">false</span>;
            
            <span class="kw">NẾU</span> (<span class="var">la_co_doc</span> == <span class="kw">true</span>) <span class="var">dem_co_doc</span>++;

<span class="kw">XUẤT</span> <span class="var">dem_co_doc</span>;
</pre>
</div>