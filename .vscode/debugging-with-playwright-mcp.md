# Debugging UI Issues with Playwright MCP

This guide explains how to use Playwright MCP (Model Context Protocol) to debug UI issues in the browser by inspecting live elements, measuring styles, and verifying implementations.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Common Debugging Workflow](#common-debugging-workflow)
3. [Available Playwright Tools](#available-playwright-tools)
4. [Real-World Example: Select Component Padding Issue](#real-world-example-select-component-padding-issue)
5. [Best Practices](#best-practices)
6. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before using Playwright MCP for debugging, ensure:

1. **Development Server Running**: Your Vite dev server must be running
   ```bash
   npm run dev
   # or
   yarn dev
   ```

2. **Playwright MCP Available**: Playwright MCP tools should be available in your IDE (GitHub Copilot with MCP support)

**Note**: No authentication is required for this demo application.

---

## Common Debugging Workflow

### Step 1: Navigate to the Page

Use the `mcp_playwright_browser_navigate` tool to open the page:

```typescript
// Example: Navigate to the demo page
await mcp_playwright_browser_navigate({
  url: "http://localhost:3000"
});
```

### Step 2: Take a Snapshot

Get the accessibility tree snapshot to see the page structure:

```typescript
await mcp_playwright_browser_snapshot();
```

This returns a YAML representation of the page showing:
- Element hierarchy
- Interactive elements (buttons, links, inputs)
- Element references for further inspection
- Text content

### Step 3: Take Screenshots

Visual verification of the current state:

```typescript
await mcp_playwright_browser_take_screenshot({
  filename: "debug-screenshot.png"
});
```

Screenshots are saved to `.playwright-mcp/` directory.

### Step 4: Inspect Specific Elements

Click on elements to inspect or use the evaluate tool:

```typescript
// Evaluate JavaScript to inspect computed styles
await mcp_playwright_browser_evaluate({
  element: "Select dropdown",
  ref: "e65", // from snapshot
  function: `(element) => {
    const computedStyle = window.getComputedStyle(element);
    return {
      padding: computedStyle.padding,
      height: computedStyle.height,
      display: computedStyle.display
    };
  }`
});
```

### Step 5: Measure and Compare

Use browser tools to measure dimensions and spacing:

```typescript
// Measure element dimensions
await mcp_playwright_browser_evaluate({
  function: `() => {
    const element = document.querySelector('.select-control');
    const rect = element.getBoundingClientRect();
    return {
      width: rect.width,
      height: rect.height,
      top: rect.top,
      left: rect.left
    };
  }`
});
```

---

## Available Playwright Tools

### Navigation Tools

- **`mcp_playwright_browser_navigate`**: Navigate to a URL
- **`mcp_playwright_browser_navigate_back`**: Go back in history
- **`mcp_playwright_browser_tabs`**: Manage browser tabs

### Inspection Tools

- **`mcp_playwright_browser_snapshot`**: Get accessibility tree
- **`mcp_playwright_browser_take_screenshot`**: Capture visual state
- **`mcp_playwright_browser_evaluate`**: Run JavaScript in browser context

### Interaction Tools

- **`mcp_playwright_browser_click`**: Click elements
- **`mcp_playwright_browser_type`**: Type into inputs
- **`mcp_playwright_browser_fill_form`**: Fill multiple form fields
- **`mcp_playwright_browser_hover`**: Hover over elements
- **`mcp_playwright_browser_select_option`**: Select dropdown options

### Utility Tools

- **`mcp_playwright_browser_wait_for`**: Wait for conditions
  - Wait for text to appear/disappear
  - Wait for specific time duration

---

## Real-World Example: Select Component Padding Issue

This example demonstrates debugging inconsistent padding in Select components on the General Settings page.

### Problem Statement

The first Select component (Label Size) appeared taller than other Select components due to helperText being displayed inside the control.

### Debugging Steps

#### 1. Navigate to the Page

```typescript
// Navigate to the demo page
await mcp_playwright_browser_navigate({
  url: "http://localhost:3000"
});

// Wait for page to load
await mcp_playwright_browser_wait_for({ time: 2 });
```

#### 2. Take Initial Screenshot

```typescript
await mcp_playwright_browser_take_screenshot({
  filename: "general-settings-initial.png"
});
```

**Observation**: First Select appears significantly taller than others.

#### 3. Get Page Snapshot

```typescript
await mcp_playwright_browser_snapshot();
```

**Result**: Identified the Select components and their refs:
- First Select (Label Size): `ref=e65`
- Second Select (Label Filetype): `ref=e84`
- Third Select (Packing Lists): `ref=e105`

#### 4. Inspect Computed Styles

```typescript
// Inspect first Select (with helperText)
await mcp_playwright_browser_evaluate({
  function: `() => {
    const control = document.querySelector('[ref="e65"]').closest('.select__control');
    const valueContainer = control.querySelector('.select__value-container');
    const computedControl = window.getComputedStyle(control);
    const computedContainer = window.getComputedStyle(valueContainer);
    
    return {
      control: {
        height: computedControl.height,
        minHeight: computedControl.minHeight,
        padding: computedControl.padding,
        display: computedControl.display
      },
      valueContainer: {
        padding: computedContainer.padding,
        height: computedContainer.height,
        display: computedContainer.display
      }
    };
  }`
});
```

**Result**:
```json
{
  "control": {
    "height": "auto",
    "minHeight": "40px",
    "padding": "0px",
    "display": "flex"
  },
  "valueContainer": {
    "padding": "2px 8px",
    "height": "auto",
    "display": "grid"
  }
}
```

#### 5. Compare with Second Select (without helperText)

```typescript
// Inspect second Select
await mcp_playwright_browser_evaluate({
  function: `() => {
    const control = document.querySelector('[ref="e84"]').closest('.select__control');
    const computedControl = window.getComputedStyle(control);
    
    return {
      height: computedControl.height,
      minHeight: computedControl.minHeight,
      padding: computedControl.padding
    };
  }`
});
```

**Result**:
```json
{
  "height": "40px",
  "minHeight": "40px",
  "padding": "0px"
}
```

#### 6. Identify Root Cause

By comparing the computed styles:

- **First Select**: `height: auto` (expands for helperText content)
- **Other Selects**: `height: 40px` (fixed height)

The helperText was being rendered inside the `CustomSingleValue` component, causing the control to expand vertically.

#### 7. Verify Figma Design

Used Figma MCP to check the design specification:

```typescript
await mcp_figma_get_metadata({ nodeId: "123:456" });
await mcp_figma_get_screenshot({ nodeId: "123:456" });
```

**Finding**: Figma design confirmed helperText should display as a second line inside the control.

#### 8. Implement Fix

Created `CustomSingleValue` component with proper text wrapping:

```typescript
const CustomSingleValue = ({ children, ...props }: SingleValueProps<Option>) => {
  const helperText = props.selectProps.helperText;
  const value = props.getValue()?.[0];
  
  return (
    <components.SingleValue {...props}>
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        maxWidth: '100%',
        overflow: 'visible'
      }}>
        <div style={{ 
          color: '#131927',
          fontSize: getFontSize(props.selectProps.selectSize),
          lineHeight: '24px',
          whiteSpace: 'normal',
          wordBreak: 'break-word'
        }}>
          {children}
        </div>
        {helperText && value && (
          <div style={{ 
            color: '#6d717f',
            fontSize: '14px',
            lineHeight: '20px',
            whiteSpace: 'normal',
            wordBreak: 'break-word'
          }}>
            {helperText}
          </div>
        )}
      </div>
    </components.SingleValue>
  );
};
```

#### 9. Verify Fix

```typescript
// Reload page
await mcp_playwright_browser_navigate({
  url: "http://localhost:3000"
});

await mcp_playwright_browser_wait_for({ time: 2 });

// Take screenshot
await mcp_playwright_browser_take_screenshot({
  filename: "general-settings-fixed.png"
});
```

**Result**: ✅ HelperText now wraps inside the control, maintaining consistent appearance.

---

## Best Practices

### 1. **Always Take Before/After Screenshots**

Document the issue visually before making changes:

```typescript
// Before
await mcp_playwright_browser_take_screenshot({
  filename: "issue-before.png"
});

// ... make code changes ...

// After
await mcp_playwright_browser_navigate({ url: "..." }); // reload
await mcp_playwright_browser_take_screenshot({
  filename: "issue-after.png"
});
```

### 2. **Use Snapshots for Structure**

Get the accessibility tree to understand element hierarchy:

```typescript
const snapshot = await mcp_playwright_browser_snapshot();
// Examine the YAML structure to find element refs
```

### 3. **Measure Computed Styles, Not Source Code**

The browser's computed styles are the source of truth:

```typescript
// ✅ Good: Measure computed styles
const styles = window.getComputedStyle(element);

// ❌ Bad: Assume styles from source code
// CSS cascade, specificity, and inheritance affect final styles
```

### 4. **Compare Multiple Elements**

When debugging inconsistencies, measure all affected elements:

```typescript
// Measure all Select components
const selects = document.querySelectorAll('.select__control');
selects.forEach((select, index) => {
  const styles = window.getComputedStyle(select);
  console.log(`Select ${index}:`, {
    height: styles.height,
    padding: styles.padding
  });
});
```

### 5. **Test Responsive Behavior**

Verify behavior at different viewport sizes:

```typescript
// Resize viewport
await mcp_playwright_browser_resize({
  width: 375,
  height: 667
});

// Take screenshot
await mcp_playwright_browser_take_screenshot({
  filename: "mobile-view.png"
});
```

### 6. **Use Console for Complex Measurements**

Leverage browser console for detailed analysis:

```typescript
await mcp_playwright_browser_evaluate({
  function: `() => {
    // Complex DOM queries and measurements
    const elements = Array.from(document.querySelectorAll('.target'));
    return elements.map(el => {
      const rect = el.getBoundingClientRect();
      const styles = window.getComputedStyle(el);
      return {
        text: el.textContent.trim(),
        dimensions: {
          width: rect.width,
          height: rect.height
        },
        styles: {
          padding: styles.padding,
          margin: styles.margin,
          display: styles.display
        }
      };
    });
  }`
});
```

### 7. **Document Your Findings**

Create a debugging log with:
- Initial observations
- Hypothesis
- Measurements taken
- Root cause identified
- Solution implemented
- Verification results

---

## Troubleshooting

### Issue: Element Not Found

**Problem**: Playwright can't find the element by ref.

**Solution**: 
1. Take a fresh snapshot to get updated refs
2. Use CSS selectors or text content instead:

```typescript
await mcp_playwright_browser_click({
  element: "Save button",
  ref: "text=Save Changes" // Use text selector
});
```

### Issue: Page Not Loading

**Problem**: Page shows "Loading..." indefinitely.

**Solution**:
1. Wait longer before taking action:
   ```typescript
   await mcp_playwright_browser_wait_for({ time: 5 });
   ```

2. Check for JavaScript errors:
   ```typescript
   await mcp_playwright_browser_console_messages();
   ```

### Issue: Styles Don't Match Expectations

**Problem**: Computed styles differ from source code.

**Solution**:
1. Check CSS cascade and specificity
2. Inspect parent element styles (inheritance)
3. Look for `!important` rules
4. Verify Tailwind classes are applied correctly

---

## Additional Resources

- [Playwright Documentation](https://playwright.dev/)
- [React DevTools Chrome Extension](https://chrome.google.com/webstore/detail/react-developer-tools/)
- [Chrome DevTools Documentation](https://developer.chrome.com/docs/devtools/)
- [CSS Computed Values Specification](https://www.w3.org/TR/css-cascade-3/#computed)

---

*Last Updated: November 17, 2025*
