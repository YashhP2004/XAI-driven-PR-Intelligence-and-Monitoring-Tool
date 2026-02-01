"""
Script to remove duplicate getMentions function from api.ts
"""

file_path = r"f:/XAI driven PR Intelligence and Monitoring Tool/src/lib/api.ts"

# Read the file
with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Remove lines 397-431 (0-indexed: 396-430)
# These contain the duplicate getMentions function
new_lines = lines[:396] + lines[431:]

# Write back
with open(file_path, 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

print("✅ Removed duplicate getMentions function")
print(f"Deleted lines 397-431 ({len(lines) - len(new_lines)} lines removed)")
print(f"File now has {len(new_lines)} lines (was {len(lines)})")
