## ➡️ Bài: Số tiếp K (Hoán vị kế tiếp) 
<br>
<div class="step-card border-blue">
<div class="step-badge bg-blue">Phân tích đề bài</div>

Cho số nguyên dương $N$ và số bước nhảy $K$. 

**Yêu cầu:** Tìm số lớn hơn $N$ được tạo ra bằng cách hoán vị các chữ số của $N$ sau $K$ lần biến đổi "kế tiếp". Nếu không đủ $K$ lần hoán vị, hãy xuất ra hoán vị lớn nhất.

**Ví dụ:** $N = 123, K = 2$
- Hoán vị kế tiếp 1: $132$
- Hoán vị kế tiếp 2: $213$
$\rightarrow$ Kết quả: $213$
<div class="important-note">

**📌 Dạng bài:** Addhoc, hoán vị
</div>
</div>

<div class="step-card border-orange">
<div class="step-badge bg-orange">Giải pháp thuật toán</div>

**💡 Thuật toán tìm hoán vị kế tiếp (Next Permutation)**
Để tìm hoán vị kế tiếp của một dãy, ta thực hiện các bước sau:
1.  **Tìm vị trí $i$ lớn nhất** sao cho $A[i] < A[i+1]$. (Nếu không tìm thấy, dãy đang ở hoán vị lớn nhất).
2.  **Tìm vị trí $j$ lớn nhất** sao cho $A[j] > A[i]$.
3.  **Hoán đổi** $A[i]$ và $A[j]$.
4.  **Lật ngược** đoạn từ $i+1$ đến hết dãy.

Sau khi xây dựng hàm tìm hoán vị kế tiếp ta lặp lại hàm này $K$ lần để tìm kết quả

**Mã giả thuật toán:**
<pre class="pseudocode">
<span class="kw">LẶP</span> <span class="var">bước</span> từ <span class="val">1</span> <span class="kw">ĐẾN</span> <span class="var">K</span>:
    <span class="var">i</span> = <span class="fn">Tìm_vị_trí_i_xa_nhất_mà</span>(<span class="var">A[i]</span> < <span class="var">A[i+1]</span>);
    <span class="kw">NẾU</span> (<span class="var">không_tìm_thấy_i</span>) <span class="kw">THÌ</span> <span class="kw">THOÁT_LẶP</span>; 
    
    <span class="var">j</span> = <span class="fn">Tìm_vị_trí_j_xa_nhất_mà</span>(<span class="var">A[j]</span> > <span class="var">A[i]</span>);
    <span class="fn">Hoán_đổi</span>(<span class="var">A[i]</span>, <span class="var">A[j]</span>);
    <span class="fn">Lật_ngược_đoạn</span>(<span class="var">i + 1</span>, <span class="var">cuối</span>);

<span class="kw">XUẤT</span> <span class="var">A</span>;
</pre>
</div>