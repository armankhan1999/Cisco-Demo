import os
import re
import json

def find_card_elements(directory):
    """
    Comprehensive scan for all card elements that may need background color updates.
    """
    cards_found = {
        'already_f3f3f3': [],
        'needs_update_bg_white': [],
        'needs_update_bg_gray': [],
        'needs_update_inline_style': [],
        'uses_custom_bg_color_prop': [],
        'gradient_backgrounds': []
    }

    # Card-like element indicators
    card_indicators = [
        'rounded', 'border', 'shadow', 'p-', 'px-', 'py-',
        'Card', 'KPI', 'Tile', 'Panel', 'Dashboard'
    ]

    for root, dirs, files in os.walk(directory):
        # Skip node_modules
        if 'node_modules' in root:
            continue

        for file in files:
            if file.endswith('.tsx'):
                filepath = os.path.join(root, file)
                relative_path = os.path.relpath(filepath, directory)

                try:
                    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
                        content = f.read()
                        lines = content.split('\n')

                        for line_num, line in enumerate(lines, 1):
                            # Create context window
                            context_start = max(0, line_num - 2)
                            context_end = min(len(lines), line_num + 2)
                            context = ' '.join(lines[context_start:context_end])

                            # Check if this is a card-like element
                            is_card = any(indicator in context for indicator in card_indicators)

                            if not is_card:
                                continue

                            # 1. Already using #F3F3F3
                            if '#F3F3F3' in line or '#f3f3f3' in line:
                                cards_found['already_f3f3f3'].append({
                                    'file': relative_path,
                                    'line': line_num,
                                    'snippet': line.strip()[:200],
                                    'type': 'inline style with #F3F3F3'
                                })
                                continue

                            # 2. Using bg-white
                            if re.search(r'\bbg-white\b', line):
                                cards_found['needs_update_bg_white'].append({
                                    'file': relative_path,
                                    'line': line_num,
                                    'current': 'bg-white',
                                    'suggested': 'style={{ backgroundColor: "#F3F3F3" }}',
                                    'snippet': line.strip()[:200]
                                })
                                continue

                            # 3. Using bg-gray variants
                            gray_match = re.search(r'\b(bg-gray-\d+|bg-slate-\d+|bg-zinc-\d+|bg-neutral-\d+)\b', line)
                            if gray_match:
                                cards_found['needs_update_bg_gray'].append({
                                    'file': relative_path,
                                    'line': line_num,
                                    'current': gray_match.group(1),
                                    'suggested': 'style={{ backgroundColor: "#F3F3F3" }}',
                                    'snippet': line.strip()[:200]
                                })
                                continue

                            # 4. Using inline backgroundColor (not #F3F3F3)
                            bgcolor_match = re.search(r"backgroundColor['\"]?\s*:\s*['\"]?(#[0-9A-Fa-f]{3,6}|[a-z]+)['\"]?", line)
                            if bgcolor_match:
                                color = bgcolor_match.group(1)
                                if color.lower() not in ['#f3f3f3', '#F3F3F3']:
                                    cards_found['needs_update_inline_style'].append({
                                        'file': relative_path,
                                        'line': line_num,
                                        'current': f'backgroundColor: {color}',
                                        'suggested': 'backgroundColor: "#F3F3F3"',
                                        'snippet': line.strip()[:200]
                                    })
                                continue

                            # 5. Using customBgColor prop
                            custombg_match = re.search(r'customBgColor\s*=\s*["\']([^"\']+)["\']', line)
                            if custombg_match:
                                color = custombg_match.group(1)
                                cards_found['uses_custom_bg_color_prop'].append({
                                    'file': relative_path,
                                    'line': line_num,
                                    'current': f'customBgColor="{color}"',
                                    'already_correct': color in ['#F3F3F3', '#f3f3f3'],
                                    'snippet': line.strip()[:200]
                                })
                                continue

                            # 6. Using gradient backgrounds
                            if re.search(r'\bbg-gradient-', line):
                                cards_found['gradient_backgrounds'].append({
                                    'file': relative_path,
                                    'line': line_num,
                                    'note': 'Uses gradient - may need review',
                                    'snippet': line.strip()[:200]
                                })

                except Exception as e:
                    print(f"Error processing {filepath}: {str(e)}")
                    pass

    return cards_found

# Run the scan
print("Scanning codebase for card background colors...")
src_dir = 'src'
results = find_card_elements(src_dir)

# Calculate totals
total_already_correct = len(results['already_f3f3f3']) + len([x for x in results['uses_custom_bg_color_prop'] if x['already_correct']])
total_needs_update = (
    len(results['needs_update_bg_white']) +
    len(results['needs_update_bg_gray']) +
    len(results['needs_update_inline_style']) +
    len([x for x in results['uses_custom_bg_color_prop'] if not x['already_correct']])
)

# Create summary report
summary_report = {
    'summary': {
        'total_cards_found': total_already_correct + total_needs_update + len(results['gradient_backgrounds']),
        'total_already_correct': total_already_correct,
        'total_needs_update': total_needs_update,
        'breakdown': {
            'already_using_f3f3f3': len(results['already_f3f3f3']),
            'needs_update_bg_white': len(results['needs_update_bg_white']),
            'needs_update_bg_gray': len(results['needs_update_bg_gray']),
            'needs_update_inline_style': len(results['needs_update_inline_style']),
            'uses_custom_bg_color_prop': len(results['uses_custom_bg_color_prop']),
            'gradient_backgrounds_for_review': len(results['gradient_backgrounds'])
        }
    },
    'cardsAlreadyCorrect': results['already_f3f3f3'][:20],
    'cardsNeedingUpdate': {
        'bg_white': results['needs_update_bg_white'][:20],
        'bg_gray': results['needs_update_bg_gray'][:20],
        'inline_style': results['needs_update_inline_style'][:20],
        'custom_bg_prop': results['uses_custom_bg_color_prop'][:20]
    }
}

# Save full report
with open('card_audit_report.json', 'w', encoding='utf-8') as f:
    json.dump({
        'summary': summary_report['summary'],
        'already_correct': results['already_f3f3f3'],
        'needs_update_bg_white': results['needs_update_bg_white'],
        'needs_update_bg_gray': results['needs_update_bg_gray'],
        'needs_update_inline_style': results['needs_update_inline_style'],
        'uses_custom_bg_color_prop': results['uses_custom_bg_color_prop'],
        'gradient_backgrounds': results['gradient_backgrounds']
    }, f, indent=2)

print("\n" + "="*80)
print("CARD BACKGROUND COLOR AUDIT REPORT")
print("="*80)
print(json.dumps(summary_report['summary'], indent=2))
print("\nFull report saved to: card_audit_report.json")
print("="*80)
