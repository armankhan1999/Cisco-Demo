import os
import re
import json

def find_card_elements(directory):
    cards_found = {
        'already_f3f3f3': [],
        'needs_update': [],
        'uncertain': []
    }

    # Patterns to search for
    bg_pattern = re.compile(r'(bg-white|bg-gray-\d+|bg-slate-\d+|bg-zinc-\d+|bg-neutral-\d+)')
    bgcolor_pattern = re.compile(r"backgroundColor['\"]?\s*:\s*['\"]?(#[0-9A-Fa-f]{3,6}|[a-z]+)['\"]?")
    inline_style_pattern = re.compile(r"style=\{\{[^}]*backgroundColor:\s*['\"]?(#[0-9A-Fa-f]{3,6}|[a-z]+)['\"]?")
    custom_bg_pattern = re.compile(r"customBgColor\s*=\s*['\"]?(#F3F3F3|#[0-9A-Fa-f]{3,6})['\"]?")

    # Check if it's a card-like element
    card_indicators = [
        'rounded', 'border', 'shadow', 'p-', 'px-', 'py-',
        'Card', 'KPI', 'Tile', 'Panel'
    ]

    for root, dirs, files in os.walk(directory):
        # Skip node_modules
        if 'node_modules' in root:
            continue

        for file in files:
            if file.endswith('.tsx'):
                filepath = os.path.join(root, file)
                try:
                    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
                        content = f.read()
                        lines = content.split('\n')

                        for line_num, line in enumerate(lines, 1):
                            # Check for #F3F3F3 already present
                            if '#F3F3F3' in line or '#f3f3f3' in line:
                                # Check if it's in a card-like context
                                is_card = any(indicator in line for indicator in card_indicators)
                                if is_card or 'background' in line.lower():
                                    cards_found['already_f3f3f3'].append({
                                        'file': filepath,
                                        'line': line_num,
                                        'snippet': line.strip()[:150]
                                    })

                            # Check for bg-white and similar patterns
                            bg_match = bg_pattern.search(line)
                            if bg_match:
                                # Check if this line has card indicators
                                is_card = any(indicator in line for indicator in card_indicators)
                                # Also check surrounding context (next/prev line)
                                context_lines = []
                                if line_num > 1:
                                    context_lines.append(lines[line_num-2])
                                context_lines.append(line)
                                if line_num < len(lines):
                                    context_lines.append(lines[line_num])

                                context = ' '.join(context_lines)
                                is_card = is_card or any(indicator in context for indicator in card_indicators)

                                if is_card:
                                    cards_found['needs_update'].append({
                                        'file': filepath,
                                        'line': line_num,
                                        'current': bg_match.group(1),
                                        'snippet': line.strip()[:150]
                                    })

                            # Check for backgroundColor in inline styles
                            bgcolor_match = bgcolor_pattern.search(line)
                            if bgcolor_match:
                                is_card = any(indicator in line for indicator in card_indicators)
                                if is_card or 'background' in line.lower():
                                    color = bgcolor_match.group(1)
                                    if color != '#F3F3F3' and color != '#f3f3f3':
                                        cards_found['needs_update'].append({
                                            'file': filepath,
                                            'line': line_num,
                                            'current': f'backgroundColor: {color}',
                                            'snippet': line.strip()[:150]
                                        })

                except Exception as e:
                    pass

    return cards_found

# Run the scan
src_dir = 'src'
results = find_card_elements(src_dir)

# Print summary
print(json.dumps({
    'summary': {
        'total_already_correct': len(results['already_f3f3f3']),
        'total_needs_update': len(results['needs_update']),
        'total_cards_found': len(results['already_f3f3f3']) + len(results['needs_update'])
    },
    'sample_already_correct': results['already_f3f3f3'][:10],
    'sample_needs_update': results['needs_update'][:10]
}, indent=2))
