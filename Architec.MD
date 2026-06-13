## Architecture

```mermaid
flowchart LR
    A[LeetCode Problem Page]
    B[Content Script]
    C[Background Service Worker]
    D[n8n Workflow]
    E[Notion Database]

    A --> B
    B --> C
    C --> D
    D --> E
```
