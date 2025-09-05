# Injection

The 'tspace-mysql' library is configured to automatically escape SQL injection by default.
Let's example a escape SQL injection and XSs injection:

```js
const input = "admin' OR '1'='1";
DB.escape(input);
// "admin\' OR \'1\'=\'1"

//XSS
const input = "text hello!<script>alert('XSS attack');</script>";
DB.escapeXSS(input);
// "text hello!"
```

<div class="page-nav-cards">
  <a href="#/backup" class="prev-card">
    <div class="nav-label"> 
        <span class="page-nav-arrow">←</span> 
        Previous
    </div>
    <div class="nav-title"> Backup </div>
  </a>

  <a href="#/model" class="next-card">
    <div class="nav-label">
        Next
        <span class="page-nav-arrow">→</span>
    </div>
    <div class="nav-title"> Model </div>
  </a>
</div>