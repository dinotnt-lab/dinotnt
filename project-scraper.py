import requests
import msvcrt
import colorama
import os
import json
import time

colorama.init()

TOKEN = ''

headers = {
    "Authorization": f"Bearer {TOKEN}",
    "Accept": "application/vnd.github+json",
}

repos = []
page = 1

def get(selected, repos):
    repo = repos[selected]
    url = f'https://raw.githubusercontent.com/{repo["full_name"]}/refs/heads/v2/README.md'

    with open('projects.json', 'r') as f:
        projects = json.load(f)

    while True:
        sh = input('s/h >')
        if sh == 's':
            projects['shown'].append({'title': repo['name'], 'file': url})
            break
        elif sh == 'h':
            projects['hidden'].append({'title': repo['name'], 'file': url})
            break
        print('not s or h')

    with open('projects.json', 'w') as f:
        json.dump(projects, f)
    return True

while True:
    response = requests.get(
        "https://api.github.com/user/repos",
        headers=headers,
        params={
            "per_page": 100,
            "page": page,
        },
    )

    response.raise_for_status()
    batch = response.json()

    if not batch:
        break

    repos.extend(batch)
    page += 1

repos = [repo for repo in repos if repo["full_name"].startswith("dinotnt-lab/")]

selected = 0
os.system('cls')

while True:
    os.system('cls')
    for i in range(len(repos)):
        if selected == i:
            print(
                colorama.Back.BLUE
                + repos[i]['full_name']
                + colorama.Back.RESET
            )
        else:
            print(repos[i]['full_name'])


    key = msvcrt.getwch()


    if key == '\r':
        if get(selected, repos):
            print('successful')
        else:
            print('no readme')
        

    elif key == "\xe0":
        key = msvcrt.getwch()

        arrows = {
            "H": "UP",
            "P": "DOWN",
            "K": "LEFT",
            "M": "RIGHT",
        }

        if arrows.get(key) == 'DOWN':
            selected += 1
        elif arrows.get(key) == 'UP':
            selected -= 1

        if repos:
            selected = max(0, min(selected, len(repos) - 1))
    elif key == 'q':
        break
