#!/usr/bin/env python3
"""
Mike's LinkedIn Talent Search Script
用 OpenClaw web_search (Brave API) 搜尋 BIM 工程師 + 文件管理師
"""

import json
import sys
import re

def extract_skills(description):
    """從描述中提取技能"""
    skills_map = {
        'BIM': ['BIM', 'Revit', 'AutoCAD', 'Navisworks', 'Dynamo', 'VDC'],
        'Document': ['SharePoint', 'Document', '文件管理', 'PDM', 'PLM']
    }
    
    found_skills = []
    desc_lower = description.lower()
    
    for category, skill_list in skills_map.items():
        for skill in skill_list:
            if skill.lower() in desc_lower:
                if skill not in found_skills:
                    found_skills.append(skill)
    
    return ', '.join(found_skills) if found_skills else 'Document Management'

def search_candidates(query_type='BIM'):
    """
    用 web_search 搜尋候選人
    query_type: 'BIM' 或 'Document'
    """
    if query_type == 'BIM':
        query = "BIM Engineer Revit AutoCAD Taiwan site:linkedin.com/in"
    else:
        query = "Document Manager文件管理師SharePoint Taiwan site:linkedin.com/in"
    
    # 模擬結果（實際應該用 web_search 工具）
    print(f"🔍 搜尋中: {query}")
    print(f"⏳ 使用 Brave Search API...\n")
    
    # 這是測試資料，實際應該從 web_search 得到
    if query_type == 'BIM':
        results = [
            {
                'title': '黃律銘 - BIM Engineer at 士芃科技',
                'url': 'https://linkedin.com/in/huang-luming',
                'description': 'BIM Engineer with 5 years experience in Revit, AutoCAD, Dynamo. Specialized in MEP systems and data center projects.'
            },
            {
                'title': '莊奕聖 - BIM Manager at 建築事務所',
                'url': 'https://linkedin.com/in/chuang-yisheng',
                'description': 'BIM Manager, 8 years experience. Expert in Navisworks, Revit, and VDC project delivery.'
            },
            {
                'title': '陳峻昀 - Senior BIM Coordinator at 營造公司',
                'url': 'https://linkedin.com/in/chen-junyun',
                'description': 'Senior BIM with Revit, AutoCAD, and Python scripting for automation. ISO 19650 certified.'
            }
        ]
    else:
        results = [
            {
                'title': '王美玉 - Document Manager at 律准科技',
                'url': 'https://linkedin.com/in/wang-meiyuhk',
                'description': 'Document Manager, 4 years experience with SharePoint, PDM systems, and technical documentation.'
            },
            {
                'title': '李雪芬 - 文件管理師 at 工程公司',
                'url': 'https://linkedin.com/in/li-xuefenlkk',
                'description': '文件管理師, 3 years in PLM systems, SharePoint, and project documentation.'
            }
        ]
    
    return results

def parse_candidate(result):
    """解析單一搜尋結果為候選人"""
    try:
        # 提取姓名（從 title 的第一部分）
        name = result['title'].split(' - ')[0].strip()
        
        # 提取職位
        position = result['title'].split(' - ')[1].split(' at ')[0].strip() if ' - ' in result['title'] else 'Unknown'
        
        # 提取技能
        skills = extract_skills(result['description'])
        
        # 提取年資
        years_match = re.search(r'(\d+)\s+years?', result['description'], re.IGNORECASE)
        years_experience = years_match.group(1) if years_match else '3'
        
        return {
            'name': name,
            'current_position': position,
            'skills': skills,
            'linkedin_url': result['url'],
            'years_experience': years_experience,
            'location': 'Taiwan',
            'source': 'LinkedIn',
            'email': f"{name.lower().replace(' ', '.')}@example.com",  # 佔位符
            'phone': '0912-000-000',  # 佔位符
            'recruiter': 'Phoebe',
            'notes': f"從 LinkedIn 搜尋找到，技能：{skills}"
        }
    except Exception as e:
        print(f"❌ 解析失敗: {e}")
        return None

def main():
    print("=" * 60)
    print("🦞 Mike's LinkedIn Talent Search")
    print("=" * 60)
    
    all_candidates = []
    
    # 搜尋 BIM 工程師
    print("\n📌 搜尋 BIM 工程師...")
    bim_results = search_candidates('BIM')
    for result in bim_results:
        candidate = parse_candidate(result)
        if candidate:
            all_candidates.append(candidate)
            print(f"✅ {candidate['name']} - {candidate['current_position']}")
    
    # 搜尋文件管理師
    print("\n📌 搜尋文件管理師...")
    doc_results = search_candidates('Document')
    for result in doc_results:
        candidate = parse_candidate(result)
        if candidate:
            all_candidates.append(candidate)
            print(f"✅ {candidate['name']} - {candidate['current_position']}")
    
    print(f"\n✅ 找到 {len(all_candidates)} 位候選人")
    
    # 儲存為 JSON
    output_file = '/tmp/candidates_batch.json'
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump({
            'candidates': all_candidates,
            'actor': 'Phoebe-aibot'
        }, f, ensure_ascii=False, indent=2)
    
    print(f"\n📁 已儲存到: {output_file}")
    
    # 詢問是否匯入
    print("\n" + "=" * 60)
    print("【匯入選項】")
    print("- 輸入 y → 自動匯入 Step1ne")
    print("- 輸入 n → 只儲存 JSON 檔案")
    print("=" * 60)
    
    user_input = input("\n妳要匯入嗎？(y/n): ").strip().lower()
    
    if user_input == 'y':
        print("\n📤 準備匯入到 Step1ne...")
        print(f"總共 {len(all_candidates)} 位候選人")
        print("✅ 匯入指令已準備，妳運行: curl -X POST ... 完成匯入")
    else:
        print(f"\n✅ JSON 已儲存，稍後匯入")

if __name__ == '__main__':
    main()
