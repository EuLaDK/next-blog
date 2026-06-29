// LoginDialog.tsx
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { Card } from '@/components/ui/card'
import { ButtonGroup } from "@/components/ui/button-group"
import { Input } from "../ui/input"

type LoginDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function LoginDialog({ open, onOpenChange }: LoginDialogProps) {

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="h-125 w-full auto-rows-min content-start sm:max-w-175">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">登录</DialogTitle>
          </DialogHeader>
          <div className="flex flex-row mt-5 items-center justify-around">
            <div className="flex flex-col gap-5">
                <InputGroup className="h-12">
            <InputGroupInput placeholder="请输入手机号" />
            <InputGroupAddon>
              +86
            </InputGroupAddon>
          </InputGroup>
          <ButtonGroup>
            <Input className="h-12" id="input-button-group" placeholder="请输入验证码" />
            <Button className="h-12" variant="outline">发送验证码</Button>
          </ButtonGroup>
            </div>
            <Card className="flex flex-col w-60 h-69 pt-9 px-6 items-center">
                <div className="w-full flex-1 h-full bg-blue-300">
                    
                </div>
                <span className="text-xl flex flex-row">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="M9.5 4C5.36 4 2 6.69 2 10c0 1.89 1.08 3.56 2.78 4.66L4 17l2.5-1.5c.89.31 1.87.5 2.91.5A5.22 5.22 0 0 1 9 14c0-3.31 3.13-6 7-6c.19 0 .38 0 .56.03C15.54 5.69 12.78 4 9.5 4m-3 2.5a1 1 0 0 1 1 1a1 1 0 0 1-1 1a1 1 0 0 1-1-1a1 1 0 0 1 1-1m5 0a1 1 0 0 1 1 1a1 1 0 0 1-1 1a1 1 0 0 1-1-1a1 1 0 0 1 1-1M16 9c-3.31 0-6 2.24-6 5s2.69 5 6 5c.67 0 1.31-.08 1.91-.25L20 20l-.62-1.87C20.95 17.22 22 15.71 22 14c0-2.76-2.69-5-6-5m-2 2.5a1 1 0 0 1 1 1a1 1 0 0 1-1 1a1 1 0 0 1-1-1a1 1 0 0 1 1-1m4 0a1 1 0 0 1 1 1a1 1 0 0 1-1 1a1 1 0 0 1-1-1a1 1 0 0 1 1-1"></path></svg>
                    微信扫码登录
                </span>
            </Card>
          </div>
          
          <DialogFooter className="mt-4 bg-white">
            <DialogClose asChild>
              <Button className="w-25 h-10" type="button" variant="outline">取消</Button>
            </DialogClose>
            <Button className="w-25 h-10" type="submit">登录</Button>
          </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
